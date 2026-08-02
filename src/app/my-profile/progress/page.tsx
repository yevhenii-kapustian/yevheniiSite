import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getBodyLogHistory } from "@/supabase/queries"
import { weightDelta, weightReportSentence } from "@/utils/weightReport"
import WeightChart from "../WeightChart"
import WeeklyWeightBars from "../WeeklyWeightBars"
import CheckInCalendar from "../CheckInCalendar"

export const metadata: Metadata = {
    title: "Your Progress - Yevhenii Fit",
}

export default async function ProgressPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const history = await getBodyLogHistory(user.id)
    const weightHistory = history.map(w => ({ loggedAt: w.logged_at, weightKg: w.weight_kg }))
    const delta = weightDelta(weightHistory)

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">Your progress</h1>

                {weightHistory.length >= 2 && delta ? (
                    <div className="flex max-w-3xl flex-col gap-6">
                        <div className="grid grid-cols-2 gap-4 sm:max-w-sm">
                            <div className="flex flex-col gap-1 rounded-xl border border-black/10 p-5">
                                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Weight</span>
                                <span className="text-2xl font-semibold text-ink-strong">{delta.current}kg</span>
                            </div>
                            <div className="flex flex-col gap-1 rounded-xl border border-black/10 p-5">
                                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Change</span>
                                <span className="text-2xl font-semibold text-ink-strong">
                                    {delta.change < 0 ? "" : delta.change > 0 ? "+" : ""}{delta.change.toFixed(1)}kg
                                </span>
                            </div>
                        </div>

                        <WeightChart data={weightHistory}/>
                        <p className="text-sm text-ink-strong/60">{weightReportSentence(weightHistory)}</p>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <WeeklyWeightBars data={weightHistory}/>
                            <CheckInCalendar checkInDates={weightHistory.map(w => w.loggedAt)}/>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-ink-strong/50">Check in a couple more times to see your weight trend.</p>
                )}
            </div>
        </section>
    )
}
