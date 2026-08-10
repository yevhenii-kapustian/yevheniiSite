'use client'

import { useRouter, usePathname } from "next/navigation"
import { CaretLeft, CaretRight } from "@phosphor-icons/react"

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

type WeekDatePickerProps = {
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

const WeekDatePicker = ({ date, maxDate }: WeekDatePickerProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const goTo = (nextDate: string) => router.push(`${pathname}?date=${nextDate}`)

    const monday = getMonday(date)
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday)
        d.setDate(d.getDate() + i)
        return toISODate(d)
    })

    const nextWeekStart = shiftDate(weekDates[0], 7)
    const isNextWeekDisabled = maxDate ? nextWeekStart > maxDate : false

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => goTo(shiftDate(weekDates[0], -7))}
                aria-label="Previous week"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 hover:bg-black/[0.08]"
            >
                <CaretLeft size={14} weight="bold"/>
            </button>

            <div className="flex gap-2">
                {weekDates.map((iso, i) => {
                    const isSelected = iso === date
                    const isDisabled = maxDate ? iso > maxDate : false

                    return (
                        <button
                            key={iso}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => goTo(iso)}
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200 ${
                                isSelected
                                    ? "bg-black text-white"
                                    : isDisabled
                                        ? "text-ink-strong/20"
                                        : "text-ink-strong/60 hover:bg-black/[0.045]"
                            }`}
                        >
                            {DAY_LABELS[i]}
                        </button>
                    )
                })}
            </div>

            <button
                type="button"
                onClick={() => goTo(shiftDate(weekDates[0], 7))}
                disabled={isNextWeekDisabled}
                aria-label="Next week"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 hover:bg-black/[0.08] disabled:opacity-30"
            >
                <CaretRight size={14} weight="bold"/>
            </button>
        </div>
    )
}

export default WeekDatePicker
