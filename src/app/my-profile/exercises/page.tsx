import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getProductPrice, getTrainingPlanWithExercises, getTrainingPlanForWeek, getWorkoutLogsForDate } from "@/supabase/queries"
import { getISOWeekKey } from "@/utils/planGenerator"
import AddModuleButton from "../AddModuleButton"
import WorkoutTracker from "./WorkoutTracker"
import { BUNDLE_PRODUCT_ID } from "@/data/products"
import { getModuleState, upsellCopy } from "@/utils/entitlements"

export const metadata: Metadata = {
    title: "Exercises - Yevhenii Fit",
}

type PageProps = {
    searchParams: Promise<{ day?: string, week?: string }>
}

export default async function ExercisesPage ({ searchParams }: PageProps) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const entitlements = await getEntitlementsForUser(user.id)
    const hasTraining = entitlements.some(e => e.module === "training" && e.status === "active")
    const trainingState = getModuleState(entitlements, "training")
    const trainingPeriodEnd = entitlements.find(e => e.module === "training")?.current_period_end ?? null

    let content = null
    if (hasTraining) {
        const today = new Date().toISOString().slice(0, 10)
        const todayDayOfWeek = ((new Date(`${today}T00:00:00`).getDay() + 6) % 7) + 1 // Monday = 1

        const { day, week } = await searchParams
        const requestedDayOfWeek = Number(day)
        const initialDayOfWeek = requestedDayOfWeek >= 1 && requestedDayOfWeek <= 7 ? requestedDayOfWeek : todayDayOfWeek

        // weekOffset is relative to the current ISO week (0 = this week, -1 = last week, ...).
        // Future weeks don't exist yet, so clamp at 0.
        const weekOffset = Math.min(Number(week) || 0, 0)
        const isCurrentWeek = weekOffset === 0

        const monday = new Date(`${today}T00:00:00`)
        monday.setDate(monday.getDate() - (todayDayOfWeek - 1) + weekOffset * 7)
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday)
            d.setDate(d.getDate() + i)
            return d.toISOString().slice(0, 10)
        })

        const [planByDay, todayLogs] = await Promise.all([
            isCurrentWeek ? getTrainingPlanWithExercises(user.id) : getTrainingPlanForWeek(user.id, getISOWeekKey(monday)),
            getWorkoutLogsForDate(user.id, today),
        ])

        const hasPlanForWeek = planByDay !== null
        const days = Array.from({ length: 7 }, (_, i) => ({
            dayOfWeek: i + 1,
            exercises: planByDay?.get(i + 1) ?? [],
        }))

        content = (
            <WorkoutTracker
                days={days}
                todayLogs={todayLogs}
                todayDayOfWeek={todayDayOfWeek}
                initialDayOfWeek={initialDayOfWeek}
                weekOffset={weekOffset}
                weekDates={weekDates}
                hasPlanForWeek={hasPlanForWeek}
            />
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Exercises</h1>

            {hasTraining ? content : await (async () => {
                const bundlePrice = await getProductPrice(BUNDLE_PRODUCT_ID)
                const { message, buttonLabel } = upsellCopy(trainingState, trainingPeriodEnd, "You don't have a training plan yet.", bundlePrice)
                return (
                    <div className="flex flex-col items-start gap-3">
                        <p className="text-sm text-ink-strong/60">{message}</p>
                        <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={user.email!} label={buttonLabel}/>
                    </div>
                )
            })()}
        </div>
    )
}
