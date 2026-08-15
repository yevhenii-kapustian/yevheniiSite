'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Barbell, ForkKnife, Trash } from "@phosphor-icons/react"
import Modal from "../Modal"
import Card from "../Card"
import type { WorkoutHistoryRow } from "@/supabase/queries"

type MealRow = {
    logged_date: string
    calories: number
    name: string | null
    meal_type: string | null
    protein_g: number | null
    fat_g: number | null
    carbs_g: number | null
}

const MEAL_TYPE_LABELS: Record<string, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Extra meal",
}

type HistoryContentProps = {
    dates: string[]
    weightByDate: Record<string, number>
    caloriesByDate: Record<string, number>
    mealsByDate: Record<string, MealRow[]>
    workoutsByDate: Record<string, WorkoutHistoryRow[]>
}

const formatDate = (dateStr: string) => new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
})

const HistoryContent = ({ dates, weightByDate, caloriesByDate, mealsByDate, workoutsByDate }: HistoryContentProps) => {
    const router = useRouter()
    const [openDate, setOpenDate] = useState<string | null>(null)
    const [openType, setOpenType] = useState<"nutrition" | "training" | null>(null)
    const [deletingWeightDate, setDeletingWeightDate] = useState<string | null>(null)

    const openModal = (date: string, type: "nutrition" | "training") => {
        setOpenDate(date)
        setOpenType(type)
    }
    const closeModal = () => {
        setOpenDate(null)
        setOpenType(null)
    }

    const handleDeleteWeight = async (loggedAt: string) => {
        setDeletingWeightDate(loggedAt)
        try {
            await fetch("/api/body-log", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loggedAt }),
            })
            router.refresh()
        } finally {
            setDeletingWeightDate(null)
        }
    }

    const meals = openDate ? (mealsByDate[openDate] ?? []) : []
    const workouts = openDate ? (workoutsByDate[openDate] ?? []) : []

    const exerciseGroups = new Map<string, { reps: number, weightKg: number }[]>()
    for (const log of workouts) {
        const sets = exerciseGroups.get(log.exerciseName) ?? []
        sets.push({ reps: log.actualReps, weightKg: log.actualWeightKg })
        exerciseGroups.set(log.exerciseName, sets)
    }

    return (
        <>
            <Card className="flex flex-col divide-y divide-black/[0.05] p-6 sm:p-7">
                <div className="hidden items-center gap-4 pb-3 text-xs font-semibold uppercase tracking-[0.1em] text-ink-strong/35 sm:flex">
                    <span className="w-28 shrink-0">Date</span>
                    <span className="flex-1">Weight</span>
                    <span className="flex-1">Nutrition</span>
                    <span className="flex-1">Training</span>
                </div>
                {dates.map(date => {
                    const hasMeals = Boolean(mealsByDate[date]?.length)
                    const hasWorkout = Boolean(workoutsByDate[date]?.length)
                    const hasWeight = Boolean(weightByDate[date])
                    const exerciseCount = hasWorkout ? new Set(workoutsByDate[date].map(w => w.exerciseName)).size : 0

                    const weightCell = hasWeight ? (
                        <span className="group/weight inline-flex items-center gap-1.5">
                            {weightByDate[date]} kg
                            <button
                                type="button"
                                onClick={() => handleDeleteWeight(date)}
                                disabled={deletingWeightDate === date}
                                aria-label="Delete this check-in"
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-ink-strong/30 opacity-0 transition-all duration-200 hover:bg-black/[0.045] hover:text-ink-strong group-hover/weight:opacity-100 disabled:opacity-40"
                            >
                                <Trash size={12} weight="bold"/>
                            </button>
                        </span>
                    ) : null

                    const nutritionCell = hasMeals ? (
                        <button
                            type="button"
                            onClick={() => openModal(date, "nutrition")}
                            className="font-medium text-ink-strong hover:underline"
                        >
                            {caloriesByDate[date].toLocaleString("en-US")} kcal
                        </button>
                    ) : (
                        <span className="text-ink-strong/30">—</span>
                    )

                    const trainingCell = hasWorkout ? (
                        <button
                            type="button"
                            onClick={() => openModal(date, "training")}
                            className="font-medium text-ink-strong hover:underline"
                        >
                            {exerciseCount} exercise{exerciseCount === 1 ? "" : "s"} logged
                        </button>
                    ) : (
                        <span className="text-ink-strong/30">—</span>
                    )

                    return (
                        <div key={date} className="py-4">
                            <div className="flex flex-col gap-3 sm:hidden">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-ink-strong">{formatDate(date)}</span>
                                    <span className="text-xs text-ink-strong/40">
                                        {hasWeight ? weightCell : "—"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-ink-strong/60">
                                        <ForkKnife size={15} weight="bold"/>
                                    </span>
                                    <div className="flex flex-1 items-center justify-between text-sm">
                                        <span className="text-ink-strong/40">Nutrition</span>
                                        {nutritionCell}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/[0.04] text-ink-strong/60">
                                        <Barbell size={15} weight="bold"/>
                                    </span>
                                    <div className="flex flex-1 items-center justify-between text-sm">
                                        <span className="text-ink-strong/40">Training</span>
                                        {trainingCell}
                                    </div>
                                </div>
                            </div>

                            <div className="hidden items-center justify-between gap-4 sm:flex">
                                <span className="w-28 shrink-0 text-sm font-medium text-ink-strong">{formatDate(date)}</span>
                                <span className="flex-1 text-sm text-ink-strong/60">
                                    {hasWeight ? weightCell : "—"}
                                </span>
                                <span className="flex-1 text-sm">{nutritionCell}</span>
                                <span className="flex-1 text-sm">{trainingCell}</span>
                            </div>
                        </div>
                    )
                })}
            </Card>

            <Modal
                open={openType === "nutrition"}
                title={openDate ? `Nutrition · ${formatDate(openDate)}` : "Nutrition"}
                onClose={closeModal}
            >
                <table className="w-full table-fixed text-sm">
                    <thead>
                        <tr className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">
                            <th className="w-1/5 pb-2 text-center font-medium">Meal</th>
                            <th className="w-1/5 pb-2 text-center font-medium">Calories</th>
                            <th className="w-1/5 pb-2 text-center font-medium">Protein</th>
                            <th className="w-1/5 pb-2 text-center font-medium">Fat</th>
                            <th className="w-1/5 pb-2 text-center font-medium">Carbs</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.06]">
                        {meals.map((meal, i) => (
                            <tr key={i}>
                                <td className="py-2 text-center font-medium text-ink-strong">{meal.name || MEAL_TYPE_LABELS[meal.meal_type ?? ""] || "Meal"}</td>
                                <td className="py-2 text-center text-ink-strong">{meal.calories} kcal</td>
                                <td className="py-2 text-center text-ink-strong/60">{meal.protein_g != null ? `${meal.protein_g}g` : "—"}</td>
                                <td className="py-2 text-center text-ink-strong/60">{meal.fat_g != null ? `${meal.fat_g}g` : "—"}</td>
                                <td className="py-2 text-center text-ink-strong/60">{meal.carbs_g != null ? `${meal.carbs_g}g` : "—"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal>

            <Modal
                open={openType === "training"}
                title={openDate ? `Training · ${formatDate(openDate)}` : "Training"}
                onClose={closeModal}
            >
                <table className="w-full table-fixed text-sm">
                    <thead>
                        <tr className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">
                            <th className="w-1/4 pb-2 text-center font-medium">Exercise</th>
                            <th className="w-1/4 pb-2 text-center font-medium">Set</th>
                            <th className="w-1/4 pb-2 text-center font-medium">Weight</th>
                            <th className="w-1/4 pb-2 text-center font-medium">Reps</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.06]">
                        {Array.from(exerciseGroups.entries()).flatMap(([exerciseName, sets]) =>
                            sets.map((set, i) => (
                                <tr key={`${exerciseName}-${i}`}>
                                    <td className="py-2 text-center font-medium text-ink-strong">{i === 0 ? exerciseName : ""}</td>
                                    <td className="py-2 text-center text-ink-strong/50">{i + 1}</td>
                                    <td className="py-2 text-center text-ink-strong">{set.weightKg}kg</td>
                                    <td className="py-2 text-center text-ink-strong">{set.reps}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </Modal>
        </>
    )
}

export default HistoryContent
