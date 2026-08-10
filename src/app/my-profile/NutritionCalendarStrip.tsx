'use client'

import { useRouter, usePathname } from "next/navigation"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

type NutritionCalendarStripProps = {
    date: string
    maxDate?: string
}

const toISODate = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

const shiftDate = (date: string, days: number) => {
    const d = new Date(`${date}T00:00:00`)
    d.setDate(d.getDate() + days)
    return toISODate(d)
}

const getMonday = (date: string) => {
    const d = new Date(`${date}T00:00:00`)
    const weekday = (d.getDay() + 6) % 7 // Monday = 0
    d.setDate(d.getDate() - weekday)
    return d
}

const NutritionCalendarStrip = ({ date, maxDate }: NutritionCalendarStripProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const goTo = (nextDate: string) => router.push(`${pathname}?date=${nextDate}`)

    const monday = getMonday(date)
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(d.getDate() + i)
        return toISODate(d)
    })

    const monthLabel = new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    const nextWeekStart = shiftDate(weekDates[0], 7)
    const isNextWeekDisabled = maxDate ? nextWeekStart > maxDate : false

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">{monthLabel}</span>
                <div className="flex items-center gap-1.5">
                    <button
                        type="button"
                        onClick={() => goTo(shiftDate(weekDates[0], -7))}
                        aria-label="Previous week"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 hover:bg-black/[0.08]"
                    >
                        <CaretLeft size={12} weight="bold"/>
                    </button>
                    <button
                        type="button"
                        onClick={() => goTo(shiftDate(weekDates[0], 7))}
                        disabled={isNextWeekDisabled}
                        aria-label="Next week"
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 hover:bg-black/[0.08] disabled:opacity-30"
                    >
                        <CaretRight size={12} weight="bold"/>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {weekDates.map((iso, i) => {
                    const isSelected = iso === date
                    const isDisabled = maxDate ? iso > maxDate : false
                    const dayNum = Number(iso.slice(8, 10))

                    return (
                        <button
                            key={iso}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => goTo(iso)}
                            className={`flex flex-col items-center gap-1.5 rounded-2xl py-2.5 transition-colors duration-200 ${
                                isSelected
                                    ? "bg-black text-white"
                                    : isDisabled
                                        ? "text-ink-strong/20"
                                        : "text-ink-strong/60 hover:bg-black/[0.045]"
                            }`}
                        >
                            <span className="text-[10px] font-medium tracking-wide opacity-60">{DAY_LABELS[i]}</span>
                            <span className="text-sm font-semibold">{dayNum}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default NutritionCalendarStrip
