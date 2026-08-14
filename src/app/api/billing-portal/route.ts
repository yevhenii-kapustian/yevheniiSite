import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { getStripe } from "@/lib/stripe";
import { getEntitlementsForUser } from "@/supabase/queries";

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const entitlements = await getEntitlementsForUser(user.id)
    const subscriptionId = entitlements.find(e => e.stripe_subscription_id)?.stripe_subscription_id

    if (!subscriptionId) {
        return NextResponse.json({ message: "No subscription found" }, { status: 404 })
    }

    const stripe = getStripe()
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.nextUrl.origin}/my-profile/settings`,
    })

    return NextResponse.json({ url: portalSession.url })
}
