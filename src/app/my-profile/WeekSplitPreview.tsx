import Link from "next/link"
import { CalendarBlank } from "@phosphor-icons/react"
import { WEEKLY_SPLIT, DAY_LABELS } from "./exercises/WorkoutDemo"

const WeekSplitPreview = () => {
    const todayIndex = (new Date().getDay() + 6) % 7 // Monday = 0

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-5 transition-shadow duration-200 hover:shadow-sm">
            <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
                    <CalendarBlank size={14} weight="bold"/>
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">This week</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {WEEKLY_SPLIT.map((day, index) => {
                    const isRest = day.exercises.length === 0
                    const isToday = index === todayIndex

                    return (
                        <div
                            key={day.label}
                            className={`flex flex-1 min-w-[70px] flex-col items-center gap-1 rounded-lg border px-2 py-2 text-center ${
                                isToday ? "border-black" : "border-black/10"
                            }`}
                        >
                            <span className="text-xs font-medium text-ink-strong/40">{DAY_LABELS[index]}</span>
                            <span className={`text-xs font-semibold ${isRest ? "text-ink-strong/30" : "text-ink-strong"}`}>
                                {isRest ? "Rest" : day.focus}
                            </span>
                        </div>
                    )
                })}
            </div>

            <Link href="/my-profile/exercises" className="text-sm font-medium text-ink-strong hover:underline">
                View full split →
            </Link>
        </div>
    )
}

export default WeekSplitPreview
