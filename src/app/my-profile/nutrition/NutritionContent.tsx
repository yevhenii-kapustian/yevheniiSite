'use client'

import { AnimatePresence, motion } from "framer-motion"
import AddMealForm from "../AddMealForm"

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
    macroCards: MacroCard[]
    meals: Meal[]
}

const NutritionContent = ({ selectedDate, isToday, macroCards, meals }: NutritionContentProps) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
            >
                {macroCards.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {macroCards.map(macro => (
                            <div key={macro.label} className="flex flex-col gap-2 rounded-2xl border border-black/10 p-5">
                                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">{macro.label}</span>
                                <span className="text-xl font-semibold text-ink-strong">
                                    {Math.round(macro.eaten).toLocaleString("en-US")}{macro.unit}
                                    <span className="text-sm font-normal text-ink-strong/40"> / {macro.goal.toLocaleString("en-US")}{macro.unit}</span>
                                </span>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${macro.eaten > macro.goal ? "bg-red-500" : "bg-black"}`}
                                        style={{ width: `${Math.min((macro.eaten / macro.goal) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="flex flex-col gap-3">
                        {meals.length > 0 ? (
                            <div className="flex flex-col divide-y divide-black/[0.06] rounded-2xl border border-black/10">
                                {meals.map(meal => (
                                    <div key={meal.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-ink-strong">{meal.name || MEAL_TYPE_LABELS[meal.meal_type ?? ""] || "Meal"}</span>
                                            <span className="text-xs text-ink-strong/40">{MEAL_TYPE_LABELS[meal.meal_type ?? ""] || "Meal"}</span>
                                        </div>
                                        <span className="font-medium text-ink-strong">{meal.calories} kcal</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-ink-strong/50">Nothing logged for this day.</p>
                        )}
                    </div>

                    {isToday && <AddMealForm/>}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default NutritionContent
