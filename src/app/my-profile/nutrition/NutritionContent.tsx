'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash } from "@phosphor-icons/react"
import AddMealForm from "../AddMealForm"
import Card from "../Card"
import { getOverageLevel, OVERAGE_TEXT_CLASSES, OVERAGE_BAR_CLASSES } from "./overage"

const MEAL_TYPE_LABELS: Record<string, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Extra meal",
}

type Meal = {
    id: number
    name: string | null
    meal_type: string | null
    calories: number
}

type MacroCard = {
    label: string
    eaten: number
    goal: number
    unit: string
}

type NutritionContentProps = {
    selectedDate: string
    isToday: boolean
    isFuture: boolean
    targetCalories: number | null
    eatenCalories: number
    macroCards: MacroCard[]
    meals: Meal[]
}

const NutritionContent = ({ selectedDate, isToday, isFuture, targetCalories, eatenCalories, macroCards, meals }: NutritionContentProps) => {
    const router = useRouter()
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const handleDelete = async (mealId: number) => {
        setDeletingId(mealId)
        setDeleteError(null)
        try {
            const res = await fetch("/api/intake", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mealId }),
            })
            if (res.ok) {
                router.refresh()
            } else {
                setDeleteError("Couldn't delete this meal — please try again.")
            }
        } catch {
            setDeleteError("Couldn't delete this meal — please try again.")
        } finally {
            setDeletingId(null)
        }
    }

    // key resets local state (delete errors/loading) on date change — no animation tied to
    // it anymore, just React's normal remount-on-key-change behavior.
    return (
        <div key={selectedDate} className="flex flex-col gap-6">
                <p className="text-sm text-ink-strong/50">
                    {isToday ? "Today" : new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    {targetCalories != null && !isFuture && (
                        <>
                            {" · "}
                            <span className={(() => {
                                const level = getOverageLevel(eatenCalories, targetCalories)
                                return level === "none" ? "" : `font-medium transition-colors duration-200 ${OVERAGE_TEXT_CLASSES[level]}`
                            })()}>
                                {Math.round(eatenCalories).toLocaleString("en-US")}
                            </span>
                            {` / ${targetCalories.toLocaleString("en-US")} kcal logged`}
                        </>
                    )}
                    {targetCalories != null && isFuture && ` · ${targetCalories.toLocaleString("en-US")} kcal target (preview)`}
                </p>

                {macroCards.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {macroCards.map(macro => {
                            const overage = getOverageLevel(macro.eaten, macro.goal)
                            return (
                                <Card key={macro.label} className="flex flex-col gap-2 p-5">
                                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">{macro.label}</span>
                                    <span className={`text-xl font-semibold tracking-tight transition-colors duration-200 ${OVERAGE_TEXT_CLASSES[overage]}`}>
                                        {Math.round(macro.eaten).toLocaleString("en-US")}{macro.unit}
                                        <span className="text-sm font-normal text-ink-strong/40"> / {macro.goal.toLocaleString("en-US")}{macro.unit}</span>
                                    </span>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.05]">
                                        <div
                                            className={`h-full rounded-full transition-all duration-300 ${OVERAGE_BAR_CLASSES[overage]}`}
                                            style={{ width: `${Math.min((macro.eaten / macro.goal) * 100, 100)}%` }}
                                        />
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        {meals.length > 0 ? (
                            <div className="card-shadow flex flex-col divide-y divide-black/[0.05] rounded-[28px] border border-black/[0.05] bg-white">
                                {meals.map(meal => (
                                    <div key={meal.id} className="group flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-ink-strong">{meal.name || MEAL_TYPE_LABELS[meal.meal_type ?? ""] || "Meal"}</span>
                                            <span className="text-xs text-ink-strong/40">{MEAL_TYPE_LABELS[meal.meal_type ?? ""] || "Meal"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-ink-strong">{meal.calories} kcal</span>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(meal.id)}
                                                disabled={deletingId === meal.id}
                                                aria-label={`Delete ${meal.name || "meal"}`}
                                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-strong/30 opacity-0 transition-all duration-200 hover:bg-black/[0.045] hover:text-ink-strong group-hover:opacity-100 disabled:opacity-40"
                                            >
                                                <Trash size={14} weight="bold"/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-ink-strong/50">Nothing logged for this day.</p>
                        )}
                        {deleteError && <p className="mt-2 text-xs text-red-500">{deleteError}</p>}
                    </div>

                    {isToday && <AddMealForm/>}
                </div>
            </div>
    )
}


export default NutritionContent
