import type { Metadata } from "next"
import { redirect } from "next/navigation"
import SetupForm from "@/components/Form/SetupForm"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getLatestBodyWeight, getProfile } from "@/supabase/queries"
import { isProfileSetupComplete } from "@/utils/profileSetup"

export const metadata: Metadata = {
    title: "Set Up Your Plan - Yevhenii Fit",
}

export default async function SetupPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const [entitlements, profile, weight] = await Promise.all([
        getEntitlementsForUser(user.id),
        getProfile(user.id),
        getLatestBodyWeight(user.id),
    ])
    const hasActiveAccess = entitlements.some(e => e.status === "active")

    if (hasActiveAccess && isProfileSetupComplete(profile, weight)) {
        redirect("/my-profile")
    }

    return <SetupForm/>
}
