import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getBodyLogHistory, getIntakeHistory } from "@/supabase/queries"

export const metadata: Metadata = {
    title: "History - Yevhenii Fit",
}

const formatDate = (dateStr: string) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
})

export default async function HistoryPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const [weightHistory, intakeHistory] = await Promise.all([
        getBodyLogHistory(user.id),
        getIntakeHistory(user.id),
    ])

    const caloriesByDate = new Map<string, number>()
    for (const row of intakeHistory) {
        caloriesByDate.set(row.logged_date, (caloriesByDate.get(row.logged_date) ?? 0) + row.calories)
    }

    const weightByDate = new Map(weightHistory.map(w => [w.logged_at, w.weight_kg]))

    const dates = Array.from(new Set([...caloriesByDate.keys(), ...weightByDate.keys()])).sort().reverse()

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">History</h1>

                {dates.length === 0 ? (
                    <p className="text-sm text-ink-strong/50">Nothing logged yet — check in or log a meal to start building your history.</p>
                ) : (
                    <div className="flex flex-col divide-y divide-black/[0.06]">
                        <div className="flex items-center gap-4 pb-2 text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">
                            <span className="w-28 shrink-0">Date</span>
                            <span className="flex-1">Weight</span>
                            <span className="flex-1">Nutrition</span>
                            <span className="flex-1">Training</span>
                        </div>
                        {dates.map(date => (
                            <div key={date} className="flex items-center justify-between gap-4 py-4">
                                <span className="w-28 shrink-0 text-sm font-medium text-ink-strong">{formatDate(date)}</span>
                                <span className="flex-1 text-sm text-ink-strong/60">
                                    {weightByDate.has(date) ? `${weightByDate.get(date)} kg` : "—"}
                                </span>
                                <span className="flex-1 text-sm text-ink-strong/60">
                                    {caloriesByDate.has(date) ? `${caloriesByDate.get(date)!.toLocaleString("en-US")} kcal` : "—"}
                                </span>
                                <span className="flex-1 text-sm text-ink-strong/30">No workout logged</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
