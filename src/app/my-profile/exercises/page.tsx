import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getTrainingPlanWithExercises, getWorkoutLogsForDate } from "@/supabase/queries"
import AddModuleButton from "../AddModuleButton"
import WorkoutTracker from "./WorkoutTracker"

export const metadata: Metadata = {
    title: "Exercises - Yevhenii Fit",
}

const BUNDLE_PRODUCT_ID = "8"

export default async function ExercisesPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const entitlements = await getEntitlementsForUser(user.id)
    const hasTraining = entitlements.some(e => e.module === "training" && e.status === "active")

    let content = null
    if (hasTraining) {
        const today = new Date().toISOString().slice(0, 10)
        const todayDayOfWeek = ((new Date(`${today}T00:00:00`).getDay() + 6) % 7) + 1 // Monday = 1

        const [planByDay, todayLogs] = await Promise.all([
            getTrainingPlanWithExercises(user.id),
            getWorkoutLogsForDate(user.id, today),
        ])

        const days = Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i + 1,
            exercises: planByDay.get(i + 1) ?? [],
        }))

        content = <WorkoutTracker days={days} todayLogs={todayLogs} todayDayOfWeek={todayDayOfWeek}/>
    }

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">Exercises</h1>

                {hasTraining ? content : (
                    <div className="flex flex-col items-start gap-3">
                        <p className="text-sm text-ink-strong/60">You don&apos;t have a training plan yet.</p>
                        <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={user.email!} label="Get full access — $45/mo"/>
                    </div>
                )}
            </div>
        </section>
    )
}
