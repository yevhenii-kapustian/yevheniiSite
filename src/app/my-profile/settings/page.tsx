import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getProfile } from "@/supabase/queries"
import SettingsContent from "./SettingsContent"

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

    const hasSubscription = entitlements.some(e => e.stripe_subscription_id)

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Settings</h1>

            <SettingsContent
                email={user.email!}
                entitlements={entitlements.map(e => ({ module: e.module, status: e.status, currentPeriodEnd: e.current_period_end }))}
                hasSubscription={hasSubscription}
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
