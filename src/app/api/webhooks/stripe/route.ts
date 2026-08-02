import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getResend } from "@/lib/resend";
import { sendMagicLinkEmail } from "@/lib/email";
import {
    getProductForFulfillment,
    getProductForEntitlement,
    getPurchaseBySessionId,
    upsertPurchase,
    getOrCreateAuthUser,
    upsertProfile,
    insertBodyLog,
    upsertEntitlement,
    updateEntitlementBySubscriptionId,
    recalculateNutritionTargetIfActive,
} from "@/supabase/queries";
import type Stripe from "stripe";

const sendPurchaseEmail = async (email: string, productName: string, downloadUrl: string) => {
    const from = process.env.RESEND_FROM_EMAIL
    if (!from) return

    const resend = getResend()
    await resend.emails.send({
        from,
        to: email,
        replyTo: "yevheni.fit@gmail.com",
        subject: `Your ${productName} is ready!`,
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
                <h1 style="font-size: 20px;">Thanks for grabbing ${productName}!</h1>
                <p style="font-size: 14px; line-height: 1.6; color: #444;">
                    Your plan is ready — tap the button below to access it.
                </p>
                <p style="margin: 24px 0;">
                    <a href="${downloadUrl}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 600; font-size: 14px;">
                        Get your link
                    </a>
                </p>
                <p style="font-size: 13px; color: #888;">
                    Any questions? Just reply to this email — I&apos;m happy to help.
                </p>
            </div>
        `,
    })
}

const fulfillOneTimePurchase = async (session: Stripe.Checkout.Session, productId: string) => {
    const product = await getProductForFulfillment(productId)
    if (!product) return

    // Check first so we only email once, even if Stripe retries this webhook.
    const existing = await getPurchaseBySessionId(session.id)

    await upsertPurchase({
        session_id: session.id,
        product_id: product.id,
        product_name: product.name,
        email: session.customer_details?.email ?? null,
        amount: session.amount_total,
        currency: session.currency,
        terms_accepted: session.metadata?.termsAccepted === "true",
    })

    const email = session.customer_details?.email
    if (!existing && email && product.download_url) {
        await sendPurchaseEmail(email, product.name, product.download_url)
    }
}

const fulfillSubscription = async (session: Stripe.Checkout.Session, productIds: string[]) => {
    const email = session.customer_details?.email
    const subscriptionId = session.subscription
    if (!email || typeof subscriptionId !== "string" || !session.success_url) return

    const products = await Promise.all(productIds.map(id => getProductForEntitlement(id)))
    const grantedProducts = products.filter((product): product is NonNullable<typeof product> & { grants_module: string } => !!product?.grants_module)
    if (grantedProducts.length === 0) return

    const stripe = getStripe()
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const currentPeriodEnd = new Date(subscription.items.data[0].current_period_end * 1000).toISOString()

    const origin = new URL(session.success_url).origin
    const { user, properties } = await getOrCreateAuthUser(email, `${origin}/welcome`)

    // Only include fields the quiz actually sent — a second purchase (e.g. adding a module
    // from the dashboard) has no quiz metadata, and upserting nulls here would wipe the
    // profile the first purchase already saved.
    const metadata = session.metadata ?? {}
    const profileUpdate: Parameters<typeof upsertProfile>[0] = { id: user.id }
    if (metadata.name) profileUpdate.full_name = metadata.name
    if (metadata.gender) profileUpdate.gender = metadata.gender
    if (metadata.height) profileUpdate.height_cm = Number(metadata.height)
    if (metadata.age) profileUpdate.age = Number(metadata.age)
    if (metadata.goal) profileUpdate.goal = metadata.goal
    if (metadata.activityLevel) profileUpdate.activity_level = metadata.activityLevel
    if (metadata.experience) profileUpdate.experience = metadata.experience
    if (metadata.daysPerWeek) profileUpdate.days_per_week = metadata.daysPerWeek
    if (metadata.equipment) profileUpdate.equipment = metadata.equipment

    await upsertProfile(profileUpdate)

    if (metadata.weight) {
        await insertBodyLog({
            user_id: user.id,
            logged_at: new Date().toISOString().slice(0, 10),
            weight_kg: Number(metadata.weight),
        })
    }

    const modules = grantedProducts.flatMap(product =>
        product.grants_module === "all" ? ["nutrition", "training"] : [product.grants_module]
    )

    for (const module of modules) {
        await upsertEntitlement({
            user_id: user.id,
            module,
            status: "active",
            stripe_subscription_id: subscriptionId,
            current_period_end: currentPeriodEnd,
        })
    }

    await recalculateNutritionTargetIfActive(user.id)
    await sendMagicLinkEmail(email, properties.action_link)
}

const subscriptionStatusToEntitlementStatus = (status: Stripe.Subscription.Status) => {
    if (status === "active" || status === "trialing") return "active"
    if (status === "canceled") return "canceled"
    return "expired"
}

export async function POST(req: NextRequest) {
    const stripe = getStripe()
    const signature = req.headers.get("stripe-signature")
    const body = await req.text()

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error) {
        console.log("Stripe webhook signature verification failed:", error)
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription") {
            const productIds = session.metadata?.productIds?.split(",").filter(Boolean) ?? []
            if (productIds.length > 0) await fulfillSubscription(session, productIds)
        } else {
            const productId = session.metadata?.productId
            if (productId) await fulfillOneTimePurchase(session, productId)
        }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription
        const updated = await updateEntitlementBySubscriptionId(
            subscription.id,
            subscriptionStatusToEntitlementStatus(subscription.status),
            new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
        )
        if (updated) await recalculateNutritionTargetIfActive(updated.user_id)
    }

    return NextResponse.json({ received: true })
}
