import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProductForFulfillment, upsertPurchase, claimPurchaseDownload } from "@/supabase/queries";

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

        const product = await getProductForFulfillment(productId)

        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        // Make sure a purchase row exists (won't touch revealed_at if it's already there,
        // e.g. created earlier by the Stripe webhook).
        await upsertPurchase({
            session_id: sessionId,
            product_id: product.id,
            product_name: product.name,
            email: session.customer_details?.email ?? null,
            amount: session.amount_total,
            currency: session.currency,
            terms_accepted: session.metadata?.termsAccepted === "true",
        }, true)

        // Atomically claim the download link: this only succeeds the *first* time
        // it's called for this session_id, so forwarding the success-page URL to
        // someone else won't let them reveal the link a second time.
        const claimed = await claimPurchaseDownload(sessionId)

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
