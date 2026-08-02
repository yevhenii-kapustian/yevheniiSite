'use client'

import { useState } from "react"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

type CheckInCalendarProps = {
    checkInDates: string[]
}

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]

const toISODate = (d: Date) => d.toISOString().slice(0, 10)

const CheckInCalendar = ({ checkInDates }: CheckInCalendarProps) => {
    const today = new Date()
    const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

    const checkInSet = new Set(checkInDates.map(d => d.slice(0, 10)))
    const todayISO = toISODate(today)

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

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-5">
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Check-ins</span>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => shiftMonth(-1)}
                        aria-label="Previous month"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-ink-strong transition-colors duration-200 hover:bg-black/5"
                    >
                        <CaretLeft size={12} weight="bold"/>
                    </button>
                    <span className="w-28 text-center text-xs font-medium text-ink-strong">{monthLabel}</span>
                    <button
                        type="button"
                        onClick={() => shiftMonth(1)}
                        aria-label="Next month"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-black/10 text-ink-strong transition-colors duration-200 hover:bg-black/5"
                    >
                        <CaretRight size={12} weight="bold"/>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAY_LABELS.map((label, i) => (
                    <span key={i} className="text-[10px] font-medium text-ink-strong/30">{label}</span>
                ))}
                {cells.map((date, i) => {
                    if (!date) return <span key={i}/>
                    const iso = toISODate(date)
                    const isCheckedIn = checkInSet.has(iso)
                    const isToday = iso === todayISO

                    return (
                        <div key={i} className="flex items-center justify-center py-0.5">
                            <span
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors duration-200 ${
                                    isCheckedIn
                                        ? "bg-black font-semibold text-white"
                                        : isToday
                                            ? "border border-black text-ink-strong"
                                            : "text-ink-strong/50"
                                }`}
                            >
                                {date.getDate()}
                            </span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CheckInCalendar
