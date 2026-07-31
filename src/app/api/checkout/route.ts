import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProductForCheckout } from "@/supabase/queries";

const QUIZ_METADATA_FIELDS = [
    "gender", "age", "height", "weight", "goal",
    "activityLevel", "experience", "daysPerWeek", "equipment", "name",
] as const

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { termsAccepted } = body
        const productIds: string[] = body.productIds ?? (body.productId ? [body.productId] : [])

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

            const subscriptionSession = await stripe.checkout.sessions.create({
                mode: "subscription",
                line_items: products.map(product => ({ price: product!.stripe_price_id!, quantity: 1 })),
                customer_email: body.email || undefined,
                metadata: quizMetadata,
                success_url: `${origin}/welcome?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/get-started`,
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
