'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SlidersHorizontal, Barbell, ForkKnife, ArrowUpRight, Bell, Trash } from "@phosphor-icons/react"
import AddModuleButton from "./AddModuleButton"
import TrainsToggle from "./TrainsToggle"
import CheckIn, { type CheckInValues } from "./CheckIn"
import Modal from "./Modal"
import Card from "./Card"
import NutritionCalendarStrip from "./NutritionCalendarStrip"
import { BUNDLE_PRODUCT_ID } from "@/data/products"
import { getWorkoutLabel } from "@/utils/workoutLabel"
import { upsellCopy, type ModuleState } from "@/utils/entitlements"

const MEAL_TYPE_LABELS: Record<string, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Extra meal",
}

type NutritionTarget = {
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

type EatenSelected = {
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

type Meal = {
    id: number
    name: string | null
    mealType: string | null
    calories: number
    createdAt: string
}

type MyPlanContentProps = {
    email: string
    fullName: string | null
    dateLabel: string
    greeting: string
    hasNutrition: boolean
    hasTraining: boolean
    nutritionState: ModuleState
    trainingState: ModuleState
    nutritionPeriodEnd: string | null
    trainingPeriodEnd: string | null
    loggedWorkoutToday: boolean
    trainsWithProgram: boolean
    activityLevel: string | null
    accountsForTraining: boolean
    checkIn: CheckInValues
    nutritionTarget: NutritionTarget | null
    selectedDate: string
    isToday: boolean
    todayMaxDate: string
    eatenSelected: EatenSelected
    meals: Meal[]
    weekDays: { dayOfWeek: number, muscleGroups: string[] }[]
}

const CalorieRing = ({ percent, size = 112 }: { percent: number, size?: number }) => {
    const clamped = Math.min(Math.max(percent, 0), 100)
    const radius = 42
    const circumference = 2 * Math.PI * radius
    const offset = circumference * (1 - clamped / 100)

    return (
        <div className="relative flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r={radius} fill="none" strokeWidth="8" className="stroke-black/[0.05]"/>
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="stroke-black transition-[stroke-dashoffset] duration-500 ease-out"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <span className="absolute text-lg font-semibold tracking-tight text-ink-strong">{Math.round(clamped)}%</span>
        </div>
    )
}

const MacroBar = ({ label, eaten, goal }: { label: string, eaten: number, goal: number }) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-ink-strong/40">
            <span>{label}</span>
            <span>{Math.round(eaten)}/{goal}g</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.05]">
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
    nutritionState,
    trainingState,
    nutritionPeriodEnd,
    trainingPeriodEnd,
    loggedWorkoutToday,
    trainsWithProgram,
    activityLevel,
    accountsForTraining,
    checkIn,
    nutritionTarget,
    selectedDate,
    isToday,
    todayMaxDate,
    eatenSelected,
    meals,
    weekDays,
}: MyPlanContentProps) => {
    const router = useRouter()
    const [checkInOpen, setCheckInOpen] = useState(false)
    const [deletingMealId, setDeletingMealId] = useState<number | null>(null)

    const handleCheckInContinue = async (values: CheckInValues) => {
        await fetch("/api/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        })
        router.refresh()
        setCheckInOpen(false)
    }

    const handleDeleteMeal = async (mealId: number) => {
        setDeletingMealId(mealId)
        try {
            await fetch("/api/intake", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mealId }),
            })
            router.refresh()
        } finally {
            setDeletingMealId(null)
        }
    }

    const remaining = nutritionTarget ? Math.max(nutritionTarget.calories - eatenSelected.calories, 0) : 0
    const percentEaten = nutritionTarget ? (eatenSelected.calories / nutritionTarget.calories) * 100 : 0

    const selectedDayOfWeek = ((new Date(`${selectedDate}T00:00:00`).getDay() + 6) % 7) + 1 // Monday = 1
    const selectedMuscleGroups = weekDays.find(d => d.dayOfWeek === selectedDayOfWeek)?.muscleGroups ?? []
    const selectedWorkoutLabel = getWorkoutLabel(selectedMuscleGroups)
    const selectedDayName = isToday ? "Today" : new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "long" })

    const showNutrition = hasNutrition && nutritionTarget

    const missingNutritionToday = isToday && hasNutrition && meals.length === 0
    const missingWorkoutToday = isToday && hasTraining && !loggedWorkoutToday
    const showNudge = missingNutritionToday || missingWorkoutToday
    const nudgeMessage = missingNutritionToday && missingWorkoutToday
        ? "You haven't logged any meals or workouts today yet."
        : missingNutritionToday
            ? "You haven't logged any meals today yet."
            : "You haven't logged a workout today yet."

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">{dateLabel}</p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">
                        {greeting}{fullName ? `, ${fullName.split(" ")[0]}` : ""}
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={() => setCheckInOpen(true)}
                    className="flex h-10 shrink-0 items-center gap-1.5 self-start rounded-full bg-black/[0.045] px-4 text-sm font-medium text-ink-strong transition-colors duration-200 hover:bg-black/[0.08]"
                >
                    <SlidersHorizontal size={16}/>
                    Update stats
                </button>
            </div>

            {showNudge && (
                <Card className="flex items-center gap-3 px-5 py-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
                        <Bell size={14} weight="bold"/>
                    </span>
                    <p className="text-sm text-ink-strong/70">{nudgeMessage}</p>
                </Card>
            )}

            {showNutrition && (
                <Card className="p-5 sm:p-6">
                    <NutritionCalendarStrip date={selectedDate} maxDate={todayMaxDate}/>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {showNutrition ? (
                    <Card className="flex flex-col justify-between gap-6 p-6 sm:p-7 lg:col-span-2">
                        <div className="flex items-start justify-between gap-6">
                            <div className="flex flex-col gap-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">
                                    {isToday ? "Remaining" : "Logged"}
                                </span>
                                <p className="text-4xl font-semibold tracking-tight text-ink-strong sm:text-5xl">
                                    {remaining.toLocaleString("en-US")}
                                    <span className="ml-1.5 text-base font-normal text-ink-strong/40">kcal</span>
                                </p>
                                <div className="flex items-center gap-4 text-xs text-ink-strong/45">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-black/20"/>
                                        Goal {nutritionTarget.calories.toLocaleString("en-US")}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-black"/>
                                        Eaten {Math.round(eatenSelected.calories).toLocaleString("en-US")}
                                    </span>
                                </div>
                            </div>

                            <CalorieRing percent={percentEaten}/>
                        </div>

                        <Link href="/my-profile/nutrition" className="flex w-fit items-center gap-1 text-sm font-medium text-ink-strong hover:underline">
                            Open nutrition <ArrowUpRight size={14} weight="bold"/>
                        </Link>
                    </Card>
                ) : (
                    <Card className="flex flex-col justify-between gap-4 p-6 sm:p-7 lg:col-span-2">
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
                                <ForkKnife size={14} weight="bold"/>
                            </span>
                            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Nutrition</span>
                        </div>
                        {(() => {
                            const { message, buttonLabel } = upsellCopy(nutritionState, nutritionPeriodEnd, "You'll need to track your own calories for now.")
                            return (
                                <>
                                    <p className="text-sm text-ink-strong/60">{message}</p>
                                    <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={email} label={buttonLabel}/>
                                </>
                            )
                        })()}
                    </Card>
                )}

                <Card className="flex flex-col justify-between gap-5 p-6 sm:p-7">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
                            <Barbell size={14} weight="bold"/>
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">{selectedDayName}</span>
                    </div>

                    {hasTraining ? (
                        <>
                            <p className="text-2xl font-semibold tracking-tight text-ink-strong">
                                {selectedWorkoutLabel === "Rest day" ? "Rest day" : `${selectedWorkoutLabel} day`}
                            </p>
                            <Link href="/my-profile/exercises" className="flex w-fit items-center gap-1 text-sm font-medium text-ink-strong hover:underline">
                                View exercises <ArrowUpRight size={14} weight="bold"/>
                            </Link>
                        </>
                    ) : (() => {
                        const { message, buttonLabel } = upsellCopy(trainingState, trainingPeriodEnd, "No training plan yet.")
                        return (
                            <>
                                <p className="text-sm text-ink-strong/60">{message}</p>
                                <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={email} label={buttonLabel}/>
                            </>
                        )
                    })()}
                </Card>
            </div>

            {showNutrition && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="flex flex-col justify-center gap-4 p-6 sm:p-7">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Macros</span>
                        <div className="flex flex-col gap-4">
                            <MacroBar label="Protein" eaten={eatenSelected.proteinG} goal={nutritionTarget.proteinG}/>
                            <MacroBar label="Carbs" eaten={eatenSelected.carbsG} goal={nutritionTarget.carbsG}/>
                            <MacroBar label="Fat" eaten={eatenSelected.fatG} goal={nutritionTarget.fatG}/>
                        </div>
                    </Card>

                    <Card className="flex flex-col gap-3 p-6 sm:p-7 lg:col-span-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Recently added</span>

                        {meals.length > 0 ? (
                            <div className="flex flex-col divide-y divide-black/[0.05]">
                                {meals.map(meal => (
                                    <div key={meal.id} className="group flex items-center gap-3 py-3 first:pt-1">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-black/[0.04] text-ink-strong/60">
                                            <ForkKnife size={16} weight="bold"/>
                                        </span>
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-sm text-ink-strong">{meal.name || MEAL_TYPE_LABELS[meal.mealType ?? ""] || "Meal"}</span>
                                            <span className="text-xs text-ink-strong/40">
                                                {MEAL_TYPE_LABELS[meal.mealType ?? ""] || "Meal"} · {new Date(meal.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-sm font-medium text-ink-strong">{meal.calories} kcal</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteMeal(meal.id)}
                                            disabled={deletingMealId === meal.id}
                                            aria-label={`Delete ${meal.name || "meal"}`}
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-strong/30 opacity-0 transition-all duration-200 hover:bg-black/[0.045] hover:text-ink-strong group-hover:opacity-100 disabled:opacity-40"
                                        >
                                            <Trash size={14} weight="bold"/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-ink-strong/50">Nothing logged {isToday ? "yet today" : "for this day"}.</p>
                        )}
                    </Card>
                </div>
            )}

            <Modal open={checkInOpen} title="Update stats" onClose={() => setCheckInOpen(false)}>
                <div className="flex flex-col gap-6">
                    <CheckIn
                        initial={checkIn}
                        activityLevel={activityLevel}
                        accountsForTraining={accountsForTraining}
                        onContinue={handleCheckInContinue}
                    />
                    {hasNutrition && !hasTraining && (
                        <div className="border-t border-black/[0.05] pt-6">
                            <TrainsToggle initialValue={trainsWithProgram}/>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}

export default MyPlanContent
