import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getProductPrice, getTrainingPlanWithExercises, getTrainingPlanForWeek, getTrainingPlanPreviewForWeek, getWorkoutLogsForDate, type TrainingPlanExercise } from "@/supabase/queries"
import { getISOWeekKey } from "@/utils/planGenerator"
import AddModuleButton from "../AddModuleButton"
import WorkoutTracker from "./WorkoutTracker"
import { BUNDLE_PRODUCT_ID } from "@/data/products"
import { getModuleState, upsellCopy } from "@/utils/entitlements"
import { getTodayLocalDate, toLocalDateString } from "@/utils/date"
import { Barbell } from "@phosphor-icons/react/dist/ssr"


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
        const today = getTodayLocalDate()
        const todayDayOfWeek = ((new Date(`${today}T00:00:00`).getDay() + 6) % 7) + 1 // Monday = 1

        const { day, week } = await searchParams
        const requestedDayOfWeek = Number(day)
        const initialDayOfWeek = requestedDayOfWeek >= 1 && requestedDayOfWeek <= 7 ? requestedDayOfWeek : todayDayOfWeek

        // weekOffset is relative to the current ISO week (0 = this week, -1 = last week, ...).
        // +1 (next week) is allowed as a read-only preview — nothing beyond that exists yet.
        const weekOffset = Math.min(Number(week) || 0, 1)
        const isCurrentWeek = weekOffset === 0
        const isPreviewWeek = weekOffset === 1

        const monday = new Date(`${today}T00:00:00`)
        monday.setDate(monday.getDate() - (todayDayOfWeek - 1) + weekOffset * 7)
        const weekDates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday)
            d.setDate(d.getDate() + i)
            return toLocalDateString(d)
        })

        // Both the real (current-week) and preview plan fetches return isDeloadWeek bundled
        // with the exercises, computed from the exact same generation/row rather than a
        // second, independent query — a separate query for is_deload used to run in
        // parallel with the lazy plan creation and could read before the brand-new plan's
        // row existed, silently showing "not a deload" for a plan whose sets/weights were
        // already deload-reduced anyway.
        let planByDay: Map<number, TrainingPlanExercise[]> | null
        let isDeloadWeek: boolean
        let todayLogs: Awaited<ReturnType<typeof getWorkoutLogsForDate>>

        if (isCurrentWeek) {
            const [plan, logs] = await Promise.all([
                getTrainingPlanWithExercises(user.id),
                getWorkoutLogsForDate(user.id, today),
            ])
            planByDay = plan.byDay
            isDeloadWeek = plan.isDeloadWeek
            todayLogs = logs
        } else if (isPreviewWeek) {
            const [preview, logs] = await Promise.all([
                getTrainingPlanPreviewForWeek(user.id, getISOWeekKey(monday)),
                getWorkoutLogsForDate(user.id, today),
            ])
            planByDay = preview.byDay
            isDeloadWeek = preview.isDeloadWeek
            todayLogs = logs
        } else {
            [planByDay, todayLogs] = await Promise.all([
                getTrainingPlanForWeek(user.id, getISOWeekKey(monday)),
                getWorkoutLogsForDate(user.id, today),
            ])
            isDeloadWeek = false
        }

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
                isPreviewWeek={isPreviewWeek}
                isDeloadWeek={isDeloadWeek}
            />
        )
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                    <Barbell size={16} weight="bold"/>
                </span>
                <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Exercises</h1>
            </div>

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
