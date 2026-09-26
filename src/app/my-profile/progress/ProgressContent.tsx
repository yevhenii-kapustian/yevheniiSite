'use client'

import { Barbell, ChartLineUp, ForkKnife } from "@phosphor-icons/react"
import Card, { CardIcon } from "../Card"
import WeeklyWeightBars from "../WeeklyWeightBars"
import TrainingVolumeChart from "../TrainingVolumeChart"
import PersonalRecords from "../PersonalRecords"
import NutritionAdherence from "../NutritionAdherence"
import ProgressPhotos from "./ProgressPhotos"
import BodyMeasurements from "./BodyMeasurements"
import type { WeeklyVolumePoint, PersonalRecord } from "@/utils/trainingReport"

type Photo = { id: number, label: string, takenAt: string, url: string | null }
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
    progressPhotos: Photo[]
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
    progressPhotos,
    measurements,
}: ProgressContentProps) => {
    const hasWeightTrend = weightHistory.length >= 2 && weightDelta

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                <ProgressPhotos photos={progressPhotos}/>
            </div>

            <div className="lg:col-span-2">
                <BodyMeasurements measurements={measurements}/>
            </div>
        </div>
    )
}

export default ProgressContent
