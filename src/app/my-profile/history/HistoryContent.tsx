'use client'

import { useState } from "react"
import Modal from "../Modal"
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
    const [openDate, setOpenDate] = useState<string | null>(null)
    const [openType, setOpenType] = useState<"nutrition" | "training" | null>(null)

    const openModal = (date: string, type: "nutrition" | "training") => {
        setOpenDate(date)
        setOpenType(type)
    }
    const closeModal = () => {
        setOpenDate(null)
        setOpenType(null)
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
            <div className="flex flex-col divide-y divide-black/[0.06]">
                <div className="flex items-center gap-4 pb-2 text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">
                    <span className="w-28 shrink-0">Date</span>
                    <span className="flex-1">Weight</span>
                    <span className="flex-1">Nutrition</span>
                    <span className="flex-1">Training</span>
                </div>
                {dates.map(date => {
                    const hasMeals = Boolean(mealsByDate[date]?.length)
                    const hasWorkout = Boolean(workoutsByDate[date]?.length)

                    return (
                        <div key={date} className="flex items-center justify-between gap-4 py-4">
                            <span className="w-28 shrink-0 text-sm font-medium text-ink-strong">{formatDate(date)}</span>
                            <span className="flex-1 text-sm text-ink-strong/60">
                                {weightByDate[date] ? `${weightByDate[date]} kg` : "—"}
                            </span>
                            <span className="flex-1 text-sm">
                                {hasMeals ? (
                                    <button
                                        type="button"
                                        onClick={() => openModal(date, "nutrition")}
                                        className="text-ink-strong underline decoration-black/20 underline-offset-4 transition-colors duration-200 hover:decoration-black"
                                    >
                                        {caloriesByDate[date].toLocaleString("en-US")} kcal
                                    </button>
                                ) : (
                                    <span className="text-ink-strong/30">—</span>
                                )}
                            </span>
                            <span className="flex-1 text-sm">
                                {hasWorkout ? (
                                    <button
                                        type="button"
                                        onClick={() => openModal(date, "training")}
                                        className="text-ink-strong underline decoration-black/20 underline-offset-4 transition-colors duration-200 hover:decoration-black"
                                    >
                                        {new Set(workoutsByDate[date].map(w => w.exerciseName)).size} exercise{new Set(workoutsByDate[date].map(w => w.exerciseName)).size === 1 ? "" : "s"} logged
                                    </button>
                                ) : (
                                    <span className="text-ink-strong/30">No workout logged</span>
                                )}
                            </span>
                        </div>
                    )
                })}
            </div>

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
