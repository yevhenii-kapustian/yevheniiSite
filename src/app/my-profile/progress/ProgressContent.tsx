'use client'

import { Barbell, ChartLineUp, CheckCircle, ForkKnife, TrendDown, TrendUp } from "@phosphor-icons/react"
import Card, { CardIcon } from "../Card"
import WeeklyWeightBars from "../WeeklyWeightBars"
import TrainingVolumeChart from "../TrainingVolumeChart"
import PersonalRecords from "../PersonalRecords"
import NutritionAdherence from "../NutritionAdherence"
import BodyMeasurements from "./BodyMeasurements"
import type { WeeklyVolumePoint, PersonalRecord } from "@/utils/trainingReport"

type Measurement = {
    id: number
    logged_at: string
    waist_cm: number | null
    chest_cm: number | null
    hips_cm: number | null
    thigh_cm: number | null
    arm_cm: number | null
}

type WeightPoint = { loggedAt: string, weightKg: number }
type WeightDelta = { days: number, change: number, current: number }
type SummaryMetric = { label: string, value: string, caption: string }

type ProgressContentProps = {
    hasTraining: boolean
    hasNutrition: boolean
    weightHistory: WeightPoint[]
    weightDelta: WeightDelta | null
    weightReport: string | null
    weeklyVolume: WeeklyVolumePoint[]
    volumeTrend: string | null
    personalRecords: PersonalRecord[]
    exerciseOptions: { planExerciseId: number, name: string }[]
    workoutDaysThisWeek: number
    plannedDaysThisWeek: number
    intakeHistory: { logged_date: string, calories: number }[]
    nutritionTargetCalories: number
    measurements: Measurement[]
}

const CardHeader = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) => (
    <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
            <CardIcon>{icon}</CardIcon>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">{label}</span>
        </div>
        {value && <span className="text-sm font-semibold text-ink-strong">{value}</span>}
    </div>
)

const getLoggedNutritionDays = (intakeHistory: { logged_date: string }[]) =>
    new Set(intakeHistory.map(row => row.logged_date)).size

const formatWeightChange = (change: number) => {
    if (Math.abs(change) < 0.1) return "0.0kg"
    return `${change > 0 ? "+" : "-"}${Math.abs(change).toFixed(1)}kg`
}

const getVolumeChangeLabel = (points: WeeklyVolumePoint[]) => {
    if (points.length < 2) return null

    const last = points[points.length - 1]
    const prev = points[points.length - 2]
    if (prev.volumeKg === 0) return null

    const changePct = Math.round(((last.volumeKg - prev.volumeKg) / prev.volumeKg) * 100)
    if (Math.abs(changePct) < 3) return "Stable"
    if (Math.abs(changePct) > 100) return changePct > 0 ? "Higher" : "Lower"
    return `${changePct > 0 ? "+" : "-"}${Math.abs(changePct)}%`
}

const getSummary = ({
    hasTraining,
    hasNutrition,
    weightDelta,
    weeklyVolume,
    workoutDaysThisWeek,
    plannedDaysThisWeek,
    intakeHistory,
}: Pick<ProgressContentProps,
    "hasTraining" |
    "hasNutrition" |
    "weightDelta" |
    "weeklyVolume" |
    "workoutDaysThisWeek" |
    "plannedDaysThisWeek" |
    "intakeHistory"
>) => {
    const metrics: SummaryMetric[] = []

    if (weightDelta) {
        metrics.push({
            label: "Weight",
            value: formatWeightChange(weightDelta.change),
            caption: `${weightDelta.days} days`,
        })
    }

    if (hasTraining && plannedDaysThisWeek > 0) {
        metrics.push({
            label: "Training",
            value: `${workoutDaysThisWeek}/${plannedDaysThisWeek}`,
            caption: "this week",
        })

        const volumeLabel = getVolumeChangeLabel(weeklyVolume)
        if (volumeLabel) {
            metrics.push({
                label: "Volume",
                value: volumeLabel,
                caption: "vs last week",
            })
        }
    }

    if (hasNutrition) {
        const loggedDays = getLoggedNutritionDays(intakeHistory)
        metrics.push({
            label: "Nutrition",
            value: loggedDays > 0 ? `${loggedDays}` : "0",
            caption: `day${loggedDays === 1 ? "" : "s"} logged`,
        })
    }

    const status = weightDelta
        ? Math.abs(weightDelta.change) < 0.1
            ? "Holding steady"
            : weightDelta.change < 0
                ? "Trending down"
                : "Trending up"
        : "Collecting data"

    const icon = weightDelta?.change
        ? weightDelta.change < 0
            ? <TrendDown size={16} weight="bold"/>
            : <TrendUp size={16} weight="bold"/>
        : <CheckCircle size={16} weight="bold"/>

    return {
        status,
        icon,
        metrics,
    }
}

const ProgressContent = ({
    hasTraining,
    hasNutrition,
    weightHistory,
    weightDelta,
    weightReport,
    weeklyVolume,
    volumeTrend,
    personalRecords,
    exerciseOptions,
    workoutDaysThisWeek,
    plannedDaysThisWeek,
    intakeHistory,
    nutritionTargetCalories,
    measurements,
}: ProgressContentProps) => {
    const hasWeightTrend = weightHistory.length >= 2 && weightDelta
    const summary = getSummary({
        hasTraining,
        hasNutrition,
        weightDelta,
        weeklyVolume,
        workoutDaysThisWeek,
        plannedDaysThisWeek,
        intakeHistory,
    })

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="flex flex-col gap-3 p-5 sm:p-7 lg:col-span-2">
                <div className="flex items-center gap-2.5">
                    <CardIcon>{summary.icon}</CardIcon>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Current direction</span>
                </div>
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight text-ink-strong">{summary.status}</h2>
                    <p className="text-sm text-ink-strong/45">Latest signals from your check-ins.</p>
                </div>
                {summary.metrics.length > 0 ? (
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {summary.metrics.map(metric => (
                            <div key={metric.label} className="rounded-2xl bg-black/[0.03] px-3 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-strong/35">{metric.label}</p>
                                <p className="mt-1 text-xl font-semibold tracking-tight text-ink-strong">{metric.value}</p>
                                <p className="text-xs text-ink-strong/40">{metric.caption}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-ink-strong/50">Log a few workouts, bodyweight check-ins, and nutrition days to see a clear progress direction here.</p>
                )}
            </Card>

            <Card className={`flex flex-col gap-4 p-5 sm:p-7 ${!hasTraining ? "lg:col-span-2" : ""}`}>
                <CardHeader
                    icon={<ChartLineUp size={14} weight="bold"/>}
                    label="Weight"
                    value={hasWeightTrend ? `${weightDelta!.current} kg` : undefined}
                />
                {hasWeightTrend ? (
                    <>
                        {weightReport && <p className="text-sm text-ink-strong/60">{weightReport}</p>}
                        <WeeklyWeightBars data={weightHistory}/>
                    </>
                ) : (
                    <p className="text-sm text-ink-strong/50">Check in a couple more times to see your weight trend.</p>
                )}
            </Card>

            {hasTraining && (
                <Card className="flex flex-col gap-4 p-5 sm:p-7">
                    <CardHeader
                        icon={<Barbell size={14} weight="bold"/>}
                        label="Training"
                        value={`${workoutDaysThisWeek}/${plannedDaysThisWeek} this week`}
                    />
                    {weeklyVolume.length >= 2 ? (
                        <TrainingVolumeChart points={weeklyVolume} trend={volumeTrend}/>
                    ) : (
                        <p className="text-sm text-ink-strong/50">Log a couple more workouts to see your volume trend.</p>
                    )}
                </Card>
            )}

            {hasTraining && (
                <Card className={`p-5 sm:p-7 ${!hasNutrition ? "lg:col-span-2" : ""}`}>
                    <PersonalRecords records={personalRecords} exerciseOptions={exerciseOptions}/>
                </Card>
            )}

            {hasNutrition && (
                <Card className={`flex flex-col gap-4 p-5 sm:p-7 ${!hasTraining ? "lg:col-span-2" : ""}`}>
                    <CardHeader icon={<ForkKnife size={14} weight="bold"/>} label="Nutrition"/>
                    <NutritionAdherence intakeHistory={intakeHistory} targetCalories={nutritionTargetCalories}/>
                </Card>
            )}

            <div className="lg:col-span-2">
                <BodyMeasurements measurements={measurements}/>
            </div>
        </div>
    )
}

export default ProgressContent
