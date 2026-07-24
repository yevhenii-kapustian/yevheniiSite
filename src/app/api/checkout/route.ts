import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

const getSupabase = () => createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const { productId } = await req.json()
        if (!productId) {
            return NextResponse.json({ message: "Missing productId" }, { status: 400 })
        }

        const supabase = getSupabase()
        const { data: product, error } = await supabase
            .from("products")
            .select("id, name, price")
            .eq("id", productId)
            .single()

        if (error || !product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        const origin = req.nextUrl.origin
        const stripe = getStripe()

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
            metadata: { productId: String(product.id) },
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/programs`,
        })

        return NextResponse.json({ url: session.url })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}
