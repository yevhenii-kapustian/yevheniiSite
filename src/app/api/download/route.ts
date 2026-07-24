import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

const getSupabase = () => createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("session_id")
        if (!sessionId) {
            return NextResponse.json({ message: "Missing session_id" }, { status: 400 })
        }

        const stripe = getStripe()
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== "paid") {
            return NextResponse.json({ message: "Payment not confirmed" }, { status: 402 })
        }

        const productId = session.metadata?.productId
        if (!productId) {
            return NextResponse.json({ message: "Missing product reference" }, { status: 400 })
        }

        const supabase = getSupabase()
        const { data: product, error } = await supabase
            .from("products")
            .select("id, name, download_url")
            .eq("id", productId)
            .single()

        if (error || !product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        // Make sure a purchase row exists (won't touch revealed_at if it's already there,
        // e.g. created earlier by the Stripe webhook).
        await supabase.from("purchases").upsert({
            session_id: sessionId,
            product_id: product.id,
            product_name: product.name,
            email: session.customer_details?.email ?? null,
            amount: session.amount_total,
            currency: session.currency,
        }, { onConflict: "session_id", ignoreDuplicates: true })

        // Atomically claim the download link: this only succeeds the *first* time
        // it's called for this session_id, so forwarding the success-page URL to
        // someone else won't let them reveal the link a second time.
        const { data: claimed } = await supabase
            .from("purchases")
            .update({ revealed_at: new Date().toISOString() })
            .eq("session_id", sessionId)
            .is("revealed_at", null)
            .select()
            .maybeSingle()

        if (!claimed) {
            return NextResponse.json({
                productName: product.name,
                downloadUrl: null,
                alreadyClaimed: true,
            })
        }

        return NextResponse.json({
            productName: product.name,
            downloadUrl: product.download_url,
        })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}
