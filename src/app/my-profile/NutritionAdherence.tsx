'use client'

import { useMemo, useState } from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"
import { getAdherenceDays, getAdherenceRate, getDailyCalories } from "@/utils/nutritionAdherence"

type IntakeRow = { logged_date: string, calories: number }

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]
const TOLERANCE_RATIO = 0.1

const toISODate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

const NutritionAdherence = ({ intakeHistory, targetCalories }: { intakeHistory: IntakeRow[], targetCalories: number }) => {
    const today = new Date()
    const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

    const caloriesByDate = useMemo(() => getDailyCalories(intakeHistory), [intakeHistory])
    const rate = useMemo(() => getAdherenceRate(getAdherenceDays(intakeHistory, targetCalories)), [intakeHistory, targetCalories])
    const loggedCount = intakeHistory.length > 0 ? new Set(intakeHistory.map(row => row.logged_date)).size : 0

    const lowerBound = targetCalories * (1 - TOLERANCE_RATIO)
    const upperBound = targetCalories * (1 + TOLERANCE_RATIO)

    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstOfMonth = new Date(year, month, 1)
    const startWeekday = (firstOfMonth.getDay() + 6) % 7 // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: (Date | null)[] = []
    for (let i = 0; i < startWeekday; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

    const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    const shiftMonth = (delta: number) => setViewDate(new Date(year, month + delta, 1))
    const todayISO = toISODate(today)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">On-target rate</span>
                <span className="text-2xl font-semibold text-ink-strong">{rate}%</span>
            </div>

            <p className="text-sm text-ink-strong/50">
                {loggedCount > 0
                    ? `Within 10% of your ${targetCalories.toLocaleString("en-US")} kcal target on ${rate}% of logged days, last 4 weeks.`
                    : "Log a few days of meals to see your adherence trend."}
            </p>

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => shiftMonth(-1)}
                        aria-label="Previous month"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-ink-strong transition-colors duration-200 hover:bg-black/5"
                    >
                        <CaretLeft size={12} weight="bold"/>
                    </button>
                    <span className="text-xs font-medium text-ink-strong">{monthLabel}</span>
                    <button
                        type="button"
                        onClick={() => shiftMonth(1)}
                        aria-label="Next month"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-ink-strong transition-colors duration-200 hover:bg-black/5"
                    >
                        <CaretRight size={12} weight="bold"/>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-y-1 text-center">
                    {WEEKDAY_LABELS.map((label, i) => (
                        <span key={i} className="text-[10px] font-medium text-ink-strong/30">{label}</span>
                    ))}
                    {cells.map((date, i) => {
                        if (!date) return <span key={i}/>
                        const iso = toISODate(date)
                        const calories = caloriesByDate.get(iso) ?? 0
                        const onTarget = calories > 0 && calories >= lowerBound && calories <= upperBound
                        const isToday = iso === todayISO

                        return (
                            <div key={i} className="flex items-center justify-center py-0.5">
                                <span
                                    title={calories > 0 ? `${calories.toLocaleString("en-US")} kcal` : "Not logged"}
                                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors duration-200 ${
                                        calories === 0
                                            ? isToday ? "border border-black/20 text-ink-strong/40" : "text-ink-strong/30"
                                            : onTarget
                                                ? "bg-black font-semibold text-white"
                                                : "bg-black/15 font-medium text-ink-strong/70"
                                    }`}
                                >
                                    {date.getDate()}
                                </span>
                            </div>
                        )
                    })}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-ink-strong/40">
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-black"/> On target</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-black/15"/> Off target</span>
                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full border border-black/20"/> Not logged</span>
                </div>
            </div>
        </div>
    )
}

export default NutritionAdherence
