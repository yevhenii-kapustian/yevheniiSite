import Link from "next/link"
import { CalendarBlank } from "@phosphor-icons/react"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type WeekSplitPreviewProps = {
    days: { dayOfWeek: number, muscleGroups: string[] }[]
}

const WeekSplitPreview = ({ days }: WeekSplitPreviewProps) => {
    const todayDayOfWeek = ((new Date().getDay() + 6) % 7) + 1 // Monday = 1

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-5 transition-shadow duration-200 hover:shadow-sm">
            <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
                    <CalendarBlank size={14} weight="bold"/>
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">This week</span>
            </div>

            <div className="flex flex-wrap gap-2">
                {days.map(day => {
                    const isRest = day.muscleGroups.length === 0
                    const isToday = day.dayOfWeek === todayDayOfWeek

                    return (
                        <Link
                            key={day.dayOfWeek}
                            href={`/my-profile/exercises?day=${day.dayOfWeek}`}
                            className={`flex flex-1 min-w-[70px] flex-col items-center gap-1 rounded-lg border px-2 py-2 text-center transition-colors duration-200 hover:border-black/40 ${
                                isToday ? "border-black" : "border-black/10"
                            }`}
                        >
                            <span className="text-xs font-medium text-ink-strong/40">{DAY_LABELS[day.dayOfWeek - 1]}</span>
                            <span className={`text-xs font-semibold ${isRest ? "text-ink-strong/30" : "text-ink-strong"}`}>
                                {isRest ? "Rest" : day.muscleGroups[0]}
                            </span>
                        </Link>
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
