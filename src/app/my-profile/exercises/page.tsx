import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser } from "@/supabase/queries"
import AddModuleButton from "../AddModuleButton"
import WorkoutDemo from "./WorkoutDemo"

export const metadata: Metadata = {
    title: "Exercises - Yevhenii Fit",
}

const TRAINING_PRODUCT_ID = "7"

export default async function ExercisesPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const entitlements = await getEntitlementsForUser(user.id)
    const hasTraining = entitlements.some(e => e.module === "training" && e.status === "active")

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">Exercises</h1>

                {hasTraining ? (
                    <WorkoutDemo/>
                ) : (
                    <div className="flex flex-col items-start gap-3">
                        <p className="text-sm text-ink-strong/60">You don&apos;t have a training plan yet.</p>
                        <AddModuleButton productId={TRAINING_PRODUCT_ID} email={user.email!} label="Add Training Plan — $25/mo"/>
                    </div>
                )}
            </div>
        </section>
    )
}
