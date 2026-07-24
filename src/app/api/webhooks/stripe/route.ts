import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import type Stripe from "stripe";

const getSupabase = () => createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
                .select("id, name")
                .eq("id", productId)
                .single()

            if (product) {
                await supabase.from("purchases").upsert({
                    session_id: session.id,
                    product_id: product.id,
                    product_name: product.name,
                    email: session.customer_details?.email ?? null,
                    amount: session.amount_total,
                    currency: session.currency,
                }, { onConflict: "session_id" })
            }
        }
    }

    return NextResponse.json({ received: true })
}
