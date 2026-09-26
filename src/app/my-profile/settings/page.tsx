import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getProfile } from "@/supabase/queries"
import { getSubscriptionPrice } from "@/lib/stripe"
import SettingsContent from "./SettingsContent"
import { Gear } from "@phosphor-icons/react/dist/ssr"

export const metadata: Metadata = {
    title: "Settings - Yevhenii Fit",
}

export default async function SettingsPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const [entitlements, profile] = await Promise.all([
        getEntitlementsForUser(user.id),
        getProfile(user.id),
    ])

    // A standalone module purchase (buying just Nutrition, or just Training, from the
    // dashboard) gets its own stripe_subscription_id separate from the bundle's — so this
    // user can genuinely end up with two independent subscriptions, not one. Pricing is
    // fetched per distinct subscription id rather than just the first one found, so the
    // second subscription isn't silently priced as "included free" in the UI.
    const subscriptionIds = Array.from(new Set(entitlements.map(e => e.stripe_subscription_id).filter((id): id is string => Boolean(id))))
    const hasSubscription = subscriptionIds.length > 0

    // Non-critical display detail — a Stripe hiccup here shouldn't take down the whole page.
    const pricesById = Object.fromEntries(await Promise.all(
        subscriptionIds.map(async id => [id, await getSubscriptionPrice(id).catch(() => null)] as const)
    ))

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                     <Gear size={16} weight="bold"/>
                </span>
                <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Settings</h1>
            </div>

            <SettingsContent
                email={user.email!}
                entitlements={entitlements.map(e => ({
                    module: e.module,
                    status: e.status,
                    currentPeriodEnd: e.current_period_end,
                    cancelAtPeriodEnd: e.cancel_at_period_end,
                    stripeSubscriptionId: e.stripe_subscription_id,
                }))}
                hasSubscription={hasSubscription}
                subscriptionPricesById={pricesById}
                trainingPrefs={{
                    experience: profile?.experience ?? null,
                    daysPerWeek: profile?.days_per_week ?? null,
                    equipment: profile?.equipment ?? null,
                    activityLevel: profile?.activity_level ?? null,
                }}
            />
        </div>
    )
}
