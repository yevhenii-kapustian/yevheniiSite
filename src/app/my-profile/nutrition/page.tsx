import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser } from "@/supabase/queries"
import AddModuleButton from "../AddModuleButton"
import NutritionDemo from "./NutritionDemo"

export const metadata: Metadata = {
    title: "Nutrition - Yevhenii Fit",
}

const NUTRITION_PRODUCT_ID = "6"

export default async function NutritionPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const entitlements = await getEntitlementsForUser(user.id)
    const hasNutrition = entitlements.some(e => e.module === "nutrition" && e.status === "active")

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">Nutrition</h1>

                {hasNutrition ? (
                    <NutritionDemo/>
                ) : (
                    <div className="flex flex-col items-start gap-3">
                        <p className="text-sm text-ink-strong/60">You don&apos;t have a nutrition plan yet.</p>
                        <AddModuleButton productId={NUTRITION_PRODUCT_ID} email={user.email!} label="Add Nutrition Plan — $25/mo"/>
                    </div>
                )}
            </div>
        </section>
    )
}
