import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getBodyLogHistory, getIntakeHistory, getWorkoutHistory } from "@/supabase/queries"
import HistoryContent from "./HistoryContent"

export const metadata: Metadata = {
    title: "History - Yevhenii Fit",
}

export default async function HistoryPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const [weightHistory, intakeHistory, workoutHistory] = await Promise.all([
        getBodyLogHistory(user.id),
        getIntakeHistory(user.id),
        getWorkoutHistory(user.id),
    ])

    const weightByDate: Record<string, number> = {}
    for (const w of weightHistory) weightByDate[w.logged_at] = w.weight_kg

    const caloriesByDate: Record<string, number> = {}
    const mealsByDate: Record<string, typeof intakeHistory> = {}
    for (const meal of intakeHistory) {
        caloriesByDate[meal.logged_date] = (caloriesByDate[meal.logged_date] ?? 0) + meal.calories
        mealsByDate[meal.logged_date] = [...(mealsByDate[meal.logged_date] ?? []), meal]
    }

    const workoutsByDate: Record<string, typeof workoutHistory> = {}
    for (const log of workoutHistory) {
        const date = log.performedAt.slice(0, 10)
        workoutsByDate[date] = [...(workoutsByDate[date] ?? []), log]
    }

    const dates = Array.from(new Set([
        ...Object.keys(weightByDate),
        ...Object.keys(caloriesByDate),
        ...Object.keys(workoutsByDate),
    ])).sort().reverse()

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">History</h1>

                {dates.length === 0 ? (
                    <p className="text-sm text-ink-strong/50">Nothing logged yet — check in or log a meal to start building your history.</p>
                ) : (
                    <HistoryContent
                        dates={dates}
                        weightByDate={weightByDate}
                        caloriesByDate={caloriesByDate}
                        mealsByDate={mealsByDate}
                        workoutsByDate={workoutsByDate}
                    />
                )}
            </div>
        </section>
    )
}
