'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "@phosphor-icons/react"
import Card from "./Card"

const MEAL_TYPES = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Extra meal" },
] as const

type MealType = typeof MEAL_TYPES[number]["value"]

const AddMealForm = () => {
    const router = useRouter()
    const [mealType, setMealType] = useState<MealType>("breakfast")
    const [name, setName] = useState("")
    const [protein, setProtein] = useState("")
    const [fat, setFat] = useState("")
    const [carbs, setCarbs] = useState("")
    const [grams, setGrams] = useState("")
    const [saving, setSaving] = useState(false)

    const caloriesPer100g = (Number(protein) || 0) * 4 + (Number(fat) || 0) * 9 + (Number(carbs) || 0) * 4
    const portionRatio = (Number(grams) || 0) / 100
    const totalCalories = Math.round(caloriesPer100g * portionRatio)
    const totalProteinG = Math.round((Number(protein) || 0) * portionRatio * 10) / 10
    const totalFatG = Math.round((Number(fat) || 0) * portionRatio * 10) / 10
    const totalCarbsG = Math.round((Number(carbs) || 0) * portionRatio * 10) / 10

    const handleAdd = async () => {
        if (!totalCalories) return
        setSaving(true)
        try {
            const res = await fetch("/api/intake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mealType,
                    name,
                    calories: totalCalories,
                    proteinG: totalProteinG || undefined,
                    fatG: totalFatG || undefined,
                    carbsG: totalCarbsG || undefined,
                }),
            })
            if (res.ok) {
                setName("")
                setProtein("")
                setFat("")
                setCarbs("")
                setGrams("")
                router.refresh()
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <Card className="flex max-w-xl flex-col gap-3 p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-1.5">
                {MEAL_TYPES.filter(type => type.value !== "snack").map(type => (
                    <button
                        key={type.value}
                        type="button"
                        onClick={() => setMealType(type.value)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${mealType === type.value ? "bg-black text-white" : "bg-black/[0.045] text-ink-strong/60 hover:bg-black/[0.08]"}`}
                    >
                        {type.label}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => setMealType("snack")}
                    aria-label="Extra meal"
                    title="Extra meal"
                    className={`flex h-[26px] w-[26px] items-center justify-center rounded-full transition-colors duration-200 ${mealType === "snack" ? "bg-black text-white" : "bg-black/[0.045] text-ink-strong/60 hover:bg-black/[0.08]"}`}
                >
                    <Plus size={12} weight="bold"/>
                </button>
            </div>
            {mealType === "snack" && (
                <span className="text-xs text-ink-strong/40">Extra meal</span>
            )}

            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="What did you eat?"
                className="w-full rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
            />

            <div className="grid grid-cols-3 gap-2">
                <input
                    type="number"
                    min="0"
                    value={protein}
                    onChange={e => setProtein(e.target.value)}
                    placeholder="protein"
                    className="w-full rounded-2xl bg-black/[0.03] px-2 py-2.5 text-center text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
                <input
                    type="number"
                    min="0"
                    value={fat}
                    onChange={e => setFat(e.target.value)}
                    placeholder="fat"
                    className="w-full rounded-2xl bg-black/[0.03] px-2 py-2.5 text-center text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
                <input
                    type="number"
                    min="0"
                    value={carbs}
                    onChange={e => setCarbs(e.target.value)}
                    placeholder="carbs"
                    className="w-full rounded-2xl bg-black/[0.03] px-2 py-2.5 text-center text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
            </div>
            <p className="text-xs text-ink-strong/35">Enter protein/fat/carbs per 100g of this food</p>

            <input
                type="number"
                min="0"
                value={grams}
                onChange={e => setGrams(e.target.value)}
                placeholder="How many grams did you eat?"
                className="w-full rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
            />

            <div className="flex items-center justify-between rounded-2xl bg-black/[0.03] px-3.5 py-2.5">
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Total calories</span>
                <span className="text-sm font-semibold text-ink-strong">{totalCalories.toLocaleString("en-US")} kcal</span>
            </div>

            <button
                type="button"
                onClick={handleAdd}
                disabled={saving || !totalCalories}
                className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
            >
                Add meal
            </button>
        </Card>
    )
}

export default AddMealForm
