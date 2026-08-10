import type { WeeklyVolumePoint } from "@/utils/trainingReport"

const MAX_BAR_HEIGHT = 120
const MIN_BAR_HEIGHT = 16

const formatWeekLabel = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const TrainingVolumeChart = ({ points, trend }: { points: WeeklyVolumePoint[], trend?: string | null }) => {
    if (points.length < 2) return null

    const values = points.map(p => p.volumeKg)
    const min = Math.min(0, ...values)
    const max = Math.max(...values)
    const range = max - min || 1

    return (
        <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Weekly volume (kg lifted)</span>
            <div className="flex items-end justify-between gap-2 overflow-x-auto">
                {points.map(point => {
                    const barHeight = MIN_BAR_HEIGHT + ((point.volumeKg - min) / range) * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT)
                    return (
                        <div key={point.weekStart} className="flex flex-1 flex-col items-center gap-1.5">
                            <span className="text-[11px] font-medium text-ink-strong/60">{point.volumeKg.toLocaleString("en-US")}</span>
                            <div className="flex w-full items-end justify-center" style={{ height: MAX_BAR_HEIGHT }}>
                                <div
                                    className="w-full max-w-8 rounded-t-lg bg-black transition-all duration-300"
                                    style={{ height: barHeight }}
                                />
                            </div>
                            <span className="text-[10px] text-ink-strong/40">{formatWeekLabel(point.weekStart)}</span>
                        </div>
                    )
                })}
            </div>
            {trend && <p className="text-sm text-ink-strong/60">{trend}</p>}
        </div>
    )
}

export default TrainingVolumeChart
