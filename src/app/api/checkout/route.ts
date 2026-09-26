import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProductForCheckout } from "@/supabase/queries";
import { parseJsonBody } from "@/lib/parseJsonBody";

const QUIZ_METADATA_FIELDS = [
    "gender", "age", "height", "weight", "goal",
    "activityLevel", "experience", "daysPerWeek", "equipment", "name",
] as const

export async function POST(req: NextRequest) {
    const { data: body, error: parseError } = await parseJsonBody(req)
    if (parseError) return parseError

    try {
        const { termsAccepted } = body
        const productIds: string[] = body.productIds ?? (body.productId ? [body.productId] : [])
        // The anonymous /get-started quiz has no account yet, so it lands on /welcome
        // (which sends a sign-in link). A logged-in user buying from /my-profile already
        // has a session, so AddModuleButton points this at /setup instead.
        const successPath = typeof body.successPath === "string" ? body.successPath : "/welcome"
        const cancelPath = typeof body.cancelPath === "string" ? body.cancelPath : "/get-started"

        if (productIds.length === 0) {
            return NextResponse.json({ message: "Missing productId" }, { status: 400 })
        }

        const products = await Promise.all(productIds.map(id => getProductForCheckout(id)))

        if (products.some(product => !product)) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        const origin = req.nextUrl.origin
        const stripe = getStripe()

        if (products.every(product => product!.is_subscription)) {
            if (products.some(product => !product!.stripe_price_id)) {
                return NextResponse.json({ message: "Product is not priced yet" }, { status: 500 })
            }

            const quizMetadata: Record<string, string> = { productIds: products.map(p => String(p!.id)).join(",") }
            for (const field of QUIZ_METADATA_FIELDS) {
                if (body[field]) quizMetadata[field] = String(body[field])
            }

            // A second, separate subscription purchase (e.g. adding Nutrition after already
            // owning Training) used to always hand Stripe a bare customer_email, which makes
            // Stripe create a BRAND NEW Customer rather than reusing the one from the first
            // purchase — leaving the new subscription attached to a customer nothing in the
            // app (billing-portal included) ever looks up, so it could never be managed or
            // canceled from the site again. Looking up any existing Stripe customer for this
            // email first, and passing `customer` instead of `customer_email` when found,
            // keeps every subscription for the same person under one Stripe customer.
            const existingCustomers = body.email ? await stripe.customers.list({ email: body.email, limit: 1 }) : null
            const customerParams = existingCustomers?.data.length
                ? { customer: existingCustomers.data[0].id }
                : { customer_email: body.email || undefined }

            const subscriptionSession = await stripe.checkout.sessions.create({
                mode: "subscription",
                line_items: products.map(product => ({ price: product!.stripe_price_id!, quantity: 1 })),
                ...customerParams,
                metadata: quizMetadata,
                success_url: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}${cancelPath}`,
            })

            return NextResponse.json({ url: subscriptionSession.url })
        }

        const product = products[0]!

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: { name: product.name },
                    unit_amount: product.price * 100,
                },
                quantity: 1,
            }],
            metadata: { productId: String(product.id), termsAccepted: termsAccepted ? "true" : "false" },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/programs`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}
