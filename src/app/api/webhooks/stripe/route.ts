import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { getResend } from "@/lib/resend";
import type Stripe from "stripe";

const getSupabase = () => createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
                        Download your plan
                    </a>
                </p>
                <p style="font-size: 13px; color: #888;">
                    Any questions? Just reply to this email — I&apos;m happy to help.
                </p>
            </div>
        `,
    })
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
        const productId = session.metadata?.productId

        if (productId) {
            const supabase = getSupabase()
            const { data: product } = await supabase
                .from("products")
                .select("id, name, download_url")
                .eq("id", productId)
                .single()

            if (product) {
                // Check first so we only email once, even if Stripe retries this webhook.
                const { data: existing } = await supabase
                    .from("purchases")
                    .select("id")
                    .eq("session_id", session.id)
                    .maybeSingle()

                await supabase.from("purchases").upsert({
                    session_id: session.id,
                    product_id: product.id,
                    product_name: product.name,
                    email: session.customer_details?.email ?? null,
                    amount: session.amount_total,
                    currency: session.currency,
                    terms_accepted: session.metadata?.termsAccepted === "true",
                }, { onConflict: "session_id" })

                const email = session.customer_details?.email
                if (!existing && email && product.download_url) {
                    await sendPurchaseEmail(email, product.name, product.download_url)
                }
            }
        }
    }

    return NextResponse.json({ received: true })
}
