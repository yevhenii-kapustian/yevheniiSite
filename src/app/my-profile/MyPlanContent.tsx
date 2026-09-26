'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SlidersHorizontal, Barbell, ForkKnife, ArrowUpRight, Bell, Trash } from "@phosphor-icons/react"
import TrainsToggle from "./TrainsToggle"
import CheckIn, { type CheckInValues } from "./CheckIn"
import Modal from "./Modal"
import Card from "./Card"
import NutritionCalendarStrip from "./NutritionCalendarStrip"
import { getWorkoutLabel } from "@/utils/workoutLabel"

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
    fullName: string | null
    dateLabel: string
    greeting: string
    hasNutrition: boolean
    hasTraining: boolean
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
    fullName,
    dateLabel,
    greeting,
    hasNutrition,
    hasTraining,
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
    const [mealError, setMealError] = useState<string | null>(null)

    const handleCheckInContinue = async (values: CheckInValues) => {
        const res = await fetch("/api/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        })
        if (!res.ok) throw new Error("Check-in failed")
        router.refresh()
        setCheckInOpen(false)
    }

    const handleDeleteMeal = async (mealId: number) => {
        setDeletingMealId(mealId)
        setMealError(null)
        try {
            const res = await fetch("/api/intake", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mealId }),
            })
            if (res.ok) {
                router.refresh()
            } else {
                setMealError("Couldn't delete this meal — please try again.")
            }
        } catch {
            setMealError("Couldn't delete this meal — please try again.")
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
        ? "Start today by opening your workout and logging your first meal."
        : missingNutritionToday
            ? "Log your first meal to start tracking today."
            : "Open today's workout when you're ready to train."

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
                <Card className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
                            <Bell size={14} weight="bold"/>
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-ink-strong">Your plan is ready</p>
                            <p className="text-sm text-ink-strong/55">{nudgeMessage}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-11 sm:pl-0">
                        {missingWorkoutToday && (
                            <Link href="/my-profile/training" className="rounded-full bg-black px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-ink-strong">
                                Start workout
                            </Link>
                        )}
                        {missingNutritionToday && (
                            <Link href="/my-profile/nutrition" className="rounded-full bg-black/[0.045] px-3.5 py-2 text-xs font-semibold text-ink-strong transition-colors duration-200 hover:bg-black/[0.08]">
                                Log meal
                            </Link>
                        )}
                    </div>
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
                            {isToday ? "Log meal" : "Open nutrition"} <ArrowUpRight size={14} weight="bold"/>
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
                        <p className="text-sm text-ink-strong/60">
                            Your nutrition access is being prepared. If you just joined, refresh in a moment or contact support.
                        </p>
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
                            <Link href="/my-profile/training" className="flex w-fit items-center gap-1 text-sm font-medium text-ink-strong hover:underline">
                                {selectedWorkoutLabel === "Rest day" ? "Open training" : "Start workout"} <ArrowUpRight size={14} weight="bold"/>
                            </Link>
                        </>
                    ) : (() => {
                        return (
                            <>
                                <p className="text-sm text-ink-strong/60">
                                    Your training access is being prepared. If you just joined, refresh in a moment or contact support.
                                </p>
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
                            <p className="text-sm text-ink-strong/50">
                                {isToday ? "Log your first meal to start tracking today." : "Nothing logged for this day."}
                            </p>
                        )}
                        {mealError && <p className="mt-2 text-xs text-red-500">{mealError}</p>}
                    </Card>
                </div>
            )}

            <Modal open={checkInOpen} title="Update stats" onClose={() => setCheckInOpen(false)} wide>
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
