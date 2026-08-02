'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlass, Plus } from "@phosphor-icons/react"

const MEAL_TYPES = [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
    { value: "snack", label: "Extra meal" },
] as const

type MealType = typeof MEAL_TYPES[number]["value"]

type FoodResult = {
    name: string
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

const AddMealForm = () => {
    const router = useRouter()
    const [mealType, setMealType] = useState<MealType>("breakfast")
    const [name, setName] = useState("")
    const [calories, setCalories] = useState("")
    const [protein, setProtein] = useState("")
    const [fat, setFat] = useState("")
    const [carbs, setCarbs] = useState("")
    const [saving, setSaving] = useState(false)

    const [query, setQuery] = useState("")
    const [results, setResults] = useState<FoodResult[]>([])
    const [searching, setSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchBoxRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        setSearching(true)
        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(`/api/food-search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                setResults(data.results ?? [])
                setShowResults(true)
            } finally {
                setSearching(false)
            }
        }, 400)

        return () => clearTimeout(timeout)
    }, [query])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
                setShowResults(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const applyResult = (result: FoodResult) => {
        setName(result.name)
        setCalories(String(result.calories))
        setProtein(String(result.proteinG))
        setFat(String(result.fatG))
        setCarbs(String(result.carbsG))
        setQuery("")
        setResults([])
        setShowResults(false)
    }

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

            <div ref={searchBoxRef} className="relative">
                <div className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 focus-within:border-black/30">
                    <MagnifyingGlass size={14} className="shrink-0 text-ink-strong/40"/>
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={() => results.length > 0 && setShowResults(true)}
                        placeholder="e.g. 200g grilled chicken breast"
                        className="w-full text-sm text-ink-strong outline-none placeholder:text-ink-strong/40"
                    />
                </div>

                {showResults && (searching || results.length > 0) && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-black/10 bg-white shadow-sm">
                        {searching ? (
                            <p className="px-3 py-2 text-xs text-ink-strong/40">Searching…</p>
                        ) : (
                            results.map((result, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => applyResult(result)}
                                    className="flex w-full flex-col items-start gap-0.5 border-b border-black/[0.06] px-3 py-2 text-left text-sm last:border-0 hover:bg-black/[0.03]"
                                >
                                    <span className="text-ink-strong">{result.name}</span>
                                    <span className="text-xs text-ink-strong/40">
                                        {result.calories} kcal · {result.proteinG}g protein · {result.fatG}g fat · {result.carbsG}g carbs
                                    </span>
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

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
