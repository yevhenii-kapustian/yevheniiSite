import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getTrainingPlanWithExercises, getWorkoutLogsForDate } from "@/supabase/queries"
import AddModuleButton from "../AddModuleButton"
import WorkoutTracker from "./WorkoutTracker"
import { BUNDLE_PRODUCT_ID } from "@/data/products"

export const metadata: Metadata = {
    title: "Exercises - Yevhenii Fit",
}

type PageProps = {
    searchParams: Promise<{ day?: string }>
}

export default async function ExercisesPage ({ searchParams }: PageProps) {
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

        const { day } = await searchParams
        const requestedDayOfWeek = Number(day)
        const initialDayOfWeek = requestedDayOfWeek >= 1 && requestedDayOfWeek <= 7 ? requestedDayOfWeek : todayDayOfWeek

        const [planByDay, todayLogs] = await Promise.all([
            getTrainingPlanWithExercises(user.id),
            getWorkoutLogsForDate(user.id, today),
        ])

        const days = Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i + 1,
            exercises: planByDay.get(i + 1) ?? [],
        }))

        content = <WorkoutTracker days={days} todayLogs={todayLogs} todayDayOfWeek={todayDayOfWeek} initialDayOfWeek={initialDayOfWeek}/>
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Exercises</h1>

            {hasTraining ? content : (
                <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-ink-strong/60">You don&apos;t have a training plan yet.</p>
                    <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={user.email!} label="Get full access — $45/mo"/>
                </div>
            )}
        </div>
    )
}
