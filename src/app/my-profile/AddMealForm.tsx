'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "@phosphor-icons/react"

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
    const [calories, setCalories] = useState("")
    const [protein, setProtein] = useState("")
    const [fat, setFat] = useState("")
    const [carbs, setCarbs] = useState("")
    const [saving, setSaving] = useState(false)

    const handleAdd = async () => {
        if (!calories) return
        setSaving(true)
        try {
            const res = await fetch("/api/intake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mealType,
                    name,
                    calories,
                    proteinG: protein || undefined,
                    fatG: fat || undefined,
                    carbsG: carbs || undefined,
                }),
            })
            if (res.ok) {
                setName("")
                setCalories("")
                setProtein("")
                setFat("")
                setCarbs("")
                router.refresh()
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex max-w-xl flex-col gap-3 rounded-2xl border border-black/10 p-5">
            <div className="flex flex-wrap items-center gap-1.5">
                {MEAL_TYPES.filter(type => type.value !== "snack").map(type => (
                    <button
                        key={type.value}
                        type="button"
                        onClick={() => setMealType(type.value)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-200 ${mealType === type.value ? "border-black bg-black text-white" : "border-black/10 text-ink-strong/60"}`}
                    >
                        {type.label}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => setMealType("snack")}
                    aria-label="Extra meal"
                    title="Extra meal"
                    className={`flex h-[26px] w-[26px] items-center justify-center rounded-full border transition-colors duration-200 ${mealType === "snack" ? "border-black bg-black text-white" : "border-black/10 text-ink-strong/60"}`}
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
                className="w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm text-ink-strong outline-none focus:border-black/30"
            />

            <div className="grid grid-cols-4 gap-2">
                <input
                    type="number"
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    placeholder="kcal"
                    className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-center text-sm text-ink-strong outline-none focus:border-black/30"
                />
                <input
                    type="number"
                    value={protein}
                    onChange={e => setProtein(e.target.value)}
                    placeholder="protein"
                    className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-center text-sm text-ink-strong outline-none focus:border-black/30"
                />
                <input
                    type="number"
                    value={fat}
                    onChange={e => setFat(e.target.value)}
                    placeholder="fat"
                    className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-center text-sm text-ink-strong outline-none focus:border-black/30"
                />
                <input
                    type="number"
                    value={carbs}
                    onChange={e => setCarbs(e.target.value)}
                    placeholder="carbs"
                    className="w-full rounded-lg border border-black/10 px-2 py-1.5 text-center text-sm text-ink-strong outline-none focus:border-black/30"
                />
            </div>

            <button
                type="button"
                onClick={handleAdd}
                disabled={saving || !calories}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
                Add meal
            </button>
        </div>
    )
}

export default AddMealForm
