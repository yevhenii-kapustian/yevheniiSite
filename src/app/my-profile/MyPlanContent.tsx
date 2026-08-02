'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SlidersHorizontal, Barbell, ForkKnife, ChartLineUp, Flame } from "@phosphor-icons/react"
import AddModuleButton from "./AddModuleButton"
import TrainsToggle from "./TrainsToggle"
import CheckIn, { type CheckInValues } from "./CheckIn"
import Modal from "./Modal"
import WeightSparkline from "./WeightSparkline"
import WeekSplitPreview from "./WeekSplitPreview"
import { BUNDLE_PRODUCT_ID } from "@/data/products"

type NutritionTarget = {
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

type EatenToday = {
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

type WeightPoint = {
    loggedAt: string
    weightKg: number
}

type MyPlanContentProps = {
    email: string
    fullName: string | null
    dateLabel: string
    greeting: string
    hasNutrition: boolean
    hasTraining: boolean
    trainsWithProgram: boolean
    activityLevel: string | null
    accountsForTraining: boolean
    checkIn: CheckInValues
    nutritionTarget: NutritionTarget | null
    eatenToday: EatenToday
    weightSummary: string | null
    weightHistory: WeightPoint[]
    checkInCount: number
    weekDays: { dayOfWeek: number, muscleGroups: string[] }[]
}

const CardIcon = ({ children }: { children: React.ReactNode }) => (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
        {children}
    </span>
)

const MacroBar = ({ label, eaten, goal }: { label: string, eaten: number, goal: number }) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-ink-strong/40">
            <span>{label}</span>
            <span>{Math.round(eaten)} / {goal}g</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-black/5">
            <div
                className="h-full rounded-full bg-black transition-all duration-300"
                style={{ width: `${Math.min((eaten / goal) * 100, 100)}%` }}
            />
        </div>
    </div>
)

const MyPlanContent = ({
    email,
    fullName,
    dateLabel,
    greeting,
    hasNutrition,
    hasTraining,
    trainsWithProgram,
    activityLevel,
    accountsForTraining,
    checkIn,
    nutritionTarget,
    eatenToday,
    weightSummary,
    weightHistory,
    checkInCount,
    weekDays,
}: MyPlanContentProps) => {
    const router = useRouter()
    const [checkInOpen, setCheckInOpen] = useState(false)

    const handleCheckInContinue = async (values: CheckInValues) => {
        await fetch("/api/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        })
        router.refresh()
        setCheckInOpen(false)
    }

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">{dateLabel}</p>
                        <h1 className="mt-1 text-3xl font-semibold text-ink-strong sm:text-4xl">
                            {greeting}{fullName ? `, ${fullName.split(" ")[0]}` : ""}
                        </h1>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCheckInOpen(true)}
                        className="flex h-10 shrink-0 items-center gap-1.5 self-start rounded-full border border-black/10 px-4 text-sm font-medium text-ink-strong transition-colors duration-200 hover:bg-black/5"
                    >
                        <SlidersHorizontal size={16}/>
                        Check-in
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-5 transition-shadow duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-2">
                            <CardIcon><Barbell size={14} weight="bold"/></CardIcon>
                            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Today&apos;s workout</span>
                        </div>
                        {hasTraining ? (
                            <>
                                <p className="text-sm font-semibold text-ink-strong">No workout scheduled yet</p>
                                <Link href="/my-profile/exercises" className="text-sm font-medium text-ink-strong hover:underline">
                                    View exercises →
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-ink-strong/60">No training plan yet.</p>
                                <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={email} label="Get full access — $45/mo"/>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-5 transition-shadow duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-2">
                            <CardIcon><ForkKnife size={14} weight="bold"/></CardIcon>
                            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Nutrition today</span>
                        </div>
                        {hasNutrition && nutritionTarget ? (
                            <>
                                <p className="text-2xl font-semibold text-ink-strong">
                                    {eatenToday.calories.toLocaleString("en-US")}
                                    <span className="text-sm font-normal text-ink-strong/40"> / {nutritionTarget.calories.toLocaleString("en-US")} kcal</span>
                                </p>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                                    <div
                                        className="h-full rounded-full bg-black transition-all duration-300"
                                        style={{ width: `${Math.min((eatenToday.calories / nutritionTarget.calories) * 100, 100)}%` }}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 border-t border-black/[0.06] pt-3">
                                    <MacroBar label="Protein" eaten={eatenToday.proteinG} goal={nutritionTarget.proteinG}/>
                                    <MacroBar label="Fat" eaten={eatenToday.fatG} goal={nutritionTarget.fatG}/>
                                    <MacroBar label="Carbs" eaten={eatenToday.carbsG} goal={nutritionTarget.carbsG}/>
                                </div>

                                <Link href="/my-profile/nutrition" className="text-sm font-medium text-ink-strong hover:underline">
                                    Open nutrition →
                                </Link>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-ink-strong/60">You&apos;ll need to track your own calories for now.</p>
                                <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={email} label="Get full access — $45/mo"/>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 rounded-xl border border-black/10 p-5 transition-shadow duration-200 hover:shadow-sm">
                        <div className="flex items-center gap-2">
                            <CardIcon><ChartLineUp size={14} weight="bold"/></CardIcon>
                            <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Progress</span>
                        </div>

                        {weightHistory.length >= 2 && <WeightSparkline data={weightHistory}/>}

                        {weightSummary ? (
                            <p className="text-2xl font-semibold text-ink-strong">{weightSummary}</p>
                        ) : (
                            <p className="text-sm text-ink-strong/60">Check in a couple more times to see your trend.</p>
                        )}

                        {checkInCount > 0 && (
                            <p className="flex items-center gap-1.5 text-xs text-ink-strong/40">
                                <Flame size={14} weight="fill" className="text-ink-strong/60"/>
                                {checkInCount} check-in{checkInCount === 1 ? "" : "s"} logged
                            </p>
                        )}

                        <Link href="/my-profile/progress" className="text-sm font-medium text-ink-strong hover:underline">
                            View chart →
                        </Link>
                    </div>
                </div>

                {hasTraining && <WeekSplitPreview days={weekDays}/>}

                <Modal open={checkInOpen} title="Weekly check-in" onClose={() => setCheckInOpen(false)}>
                    <div className="flex flex-col gap-6">
                        <CheckIn
                            initial={checkIn}
                            activityLevel={activityLevel}
                            accountsForTraining={accountsForTraining}
                            onContinue={handleCheckInContinue}
                        />
                        {hasNutrition && !hasTraining && (
                            <div className="border-t border-black/[0.06] pt-6">
                                <TrainsToggle initialValue={trainsWithProgram}/>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </section>
    )
}

export default MyPlanContent
