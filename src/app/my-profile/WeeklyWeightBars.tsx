type WeightPoint = {
    loggedAt: string
    weightKg: number
}

const MAX_BAR_HEIGHT = 120
const MIN_BAR_HEIGHT = 16

const getWeekStart = (iso: string) => {
    const date = new Date(`${iso.slice(0, 10)}T00:00:00`)
    const weekday = (date.getDay() + 6) % 7 // Monday = 0
    date.setDate(date.getDate() - weekday)
    return date.toISOString().slice(0, 10)
}

const formatWeekLabel = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const WeeklyWeightBars = ({ data }: { data: WeightPoint[] }) => {
    const weekBuckets = new Map<string, number[]>()
    for (const point of data) {
        const key = getWeekStart(point.loggedAt)
        if (!weekBuckets.has(key)) weekBuckets.set(key, [])
        weekBuckets.get(key)!.push(point.weightKg)
    }

    const weeks = Array.from(weekBuckets.entries())
        .map(([weekStart, weights]) => ({
            weekStart,
            avg: weights.reduce((sum, w) => sum + w, 0) / weights.length,
        }))
        .sort((a, b) => a.weekStart.localeCompare(b.weekStart))
        .slice(-8)

    if (weeks.length < 2) return null

    const values = weeks.map(w => w.avg)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    return (
        <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-5">
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Weekly average</span>
            <div className="flex items-end justify-between gap-3">
                {weeks.map(week => {
                    const barHeight = MIN_BAR_HEIGHT + ((week.avg - min) / range) * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT)
                    return (
                        <div key={week.weekStart} className="flex flex-1 flex-col items-center gap-1.5">
                            <span className="text-xs font-medium text-ink-strong/60">{week.avg.toFixed(1)}</span>
                            <div className="flex w-full items-end justify-center" style={{ height: MAX_BAR_HEIGHT }}>
                                <div
                                    className="w-full max-w-8 rounded-t-md bg-black transition-all duration-300"
                                    style={{ height: barHeight }}
                                />
                            </div>
                            <span className="text-[10px] text-ink-strong/40">{formatWeekLabel(week.weekStart)}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default WeeklyWeightBars
