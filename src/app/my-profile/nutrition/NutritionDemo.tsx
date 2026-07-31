'use client'

import { useState } from "react"

type MealTemplate = {
    time: string
    type: string
    name: string
    calories: number
    protein: number
    fat: number
    carbs: number
}

type DayTemplate = {
    label: string
    target: { calories: number, protein: number, fat: number, carbs: number }
    meals: MealTemplate[]
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const TARGET = { calories: 2500, protein: 180, fat: 70, carbs: 250 }

const WEEKLY_PLAN: DayTemplate[] = [
    { label: "Day 1", target: TARGET, meals: [
        { time: "08:00", type: "Breakfast", name: "Oatmeal with berries and nuts", calories: 420, protein: 22, fat: 14, carbs: 58 },
        { time: "13:30", type: "Lunch", name: "Chicken breast with rice and vegetables", calories: 610, protein: 48, fat: 16, carbs: 62 },
        { time: "16:30", type: "Snack", name: "Cottage cheese with honey and walnuts", calories: 220, protein: 18, fat: 8, carbs: 20 },
        { time: "19:30", type: "Dinner", name: "Steamed salmon with broccoli and quinoa", calories: 540, protein: 38, fat: 24, carbs: 18 },
    ] },
    { label: "Day 2", target: TARGET, meals: [
        { time: "08:00", type: "Breakfast", name: "Greek yogurt with granola", calories: 380, protein: 24, fat: 10, carbs: 48 },
        { time: "13:30", type: "Lunch", name: "Beef stir-fry with noodles", calories: 650, protein: 42, fat: 20, carbs: 70 },
        { time: "16:30", type: "Snack", name: "Protein shake with banana", calories: 260, protein: 25, fat: 4, carbs: 32 },
        { time: "19:30", type: "Dinner", name: "Turkey meatballs with mashed potatoes", calories: 580, protein: 40, fat: 18, carbs: 55 },
    ] },
    { label: "Day 3", target: TARGET, meals: [
        { time: "08:00", type: "Breakfast", name: "Scrambled eggs with toast", calories: 400, protein: 26, fat: 20, carbs: 28 },
        { time: "13:30", type: "Lunch", name: "Tuna salad with quinoa", calories: 520, protein: 38, fat: 14, carbs: 48 },
        { time: "16:30", type: "Snack", name: "Almonds and an apple", calories: 240, protein: 6, fat: 16, carbs: 22 },
        { time: "19:30", type: "Dinner", name: "Grilled chicken with sweet potato", calories: 560, protein: 44, fat: 12, carbs: 60 },
    ] },
    { label: "Day 4", target: TARGET, meals: [
        { time: "08:00", type: "Breakfast", name: "Protein pancakes with syrup", calories: 450, protein: 30, fat: 12, carbs: 55 },
        { time: "13:30", type: "Lunch", name: "Shrimp pasta", calories: 600, protein: 36, fat: 14, carbs: 78 },
        { time: "16:30", type: "Snack", name: "Rice cakes with peanut butter", calories: 230, protein: 8, fat: 12, carbs: 24 },
        { time: "19:30", type: "Dinner", name: "Beef steak with asparagus", calories: 520, protein: 45, fat: 22, carbs: 12 },
    ] },
    { label: "Day 5", target: TARGET, meals: [
        { time: "08:00", type: "Breakfast", name: "Smoothie bowl", calories: 390, protein: 20, fat: 10, carbs: 58 },
        { time: "13:30", type: "Lunch", name: "Turkey wrap with vegetables", calories: 540, protein: 36, fat: 16, carbs: 54 },
        { time: "16:30", type: "Snack", name: "Cottage cheese with pineapple", calories: 210, protein: 20, fat: 4, carbs: 22 },
        { time: "19:30", type: "Dinner", name: "Baked cod with rice", calories: 500, protein: 40, fat: 8, carbs: 60 },
    ] },
    { label: "Day 6", target: TARGET, meals: [
        { time: "08:00", type: "Breakfast", name: "Avocado toast with eggs", calories: 460, protein: 22, fat: 24, carbs: 38 },
        { time: "13:30", type: "Lunch", name: "Chicken Caesar salad", calories: 480, protein: 38, fat: 22, carbs: 20 },
        { time: "16:30", type: "Snack", name: "Trail mix", calories: 250, protein: 8, fat: 16, carbs: 20 },
        { time: "19:30", type: "Dinner", name: "Pork tenderloin with couscous", calories: 580, protein: 42, fat: 18, carbs: 58 },
    ] },
    { label: "Day 7", target: TARGET, meals: [
        { time: "08:00", type: "Breakfast", name: "French toast", calories: 420, protein: 16, fat: 14, carbs: 58 },
        { time: "13:30", type: "Lunch", name: "Grilled salmon salad", calories: 460, protein: 36, fat: 22, carbs: 16 },
        { time: "16:30", type: "Snack", name: "Greek yogurt with honey", calories: 200, protein: 16, fat: 4, carbs: 26 },
        { time: "19:30", type: "Dinner", name: "Roast chicken with vegetables", calories: 560, protein: 48, fat: 16, carbs: 40 },
    ] },
]

const buildInitialLogged = (day: DayTemplate) => day.meals.map(() => false)

const NutritionDemo = () => {
    const todayIndex = (new Date().getDay() + 6) % 7 // Monday = 0
    const [dayIndex, setDayIndex] = useState(todayIndex)
    const [logged, setLogged] = useState<boolean[]>(() => buildInitialLogged(WEEKLY_PLAN[todayIndex]))

    const day = WEEKLY_PLAN[dayIndex]

    const selectDay = (index: number) => {
        setDayIndex(index)
        setLogged(buildInitialLogged(WEEKLY_PLAN[index]))
    }

    const toggleMeal = (mealIndex: number) => {
        setLogged(prev => prev.map((value, i) => i === mealIndex ? !value : value))
    }

    const eaten = day.meals.reduce((sum, meal, i) => {
        if (!logged[i]) return sum
        return {
            calories: sum.calories + meal.calories,
            protein: sum.protein + meal.protein,
            fat: sum.fat + meal.fat,
            carbs: sum.carbs + meal.carbs,
        }
    }, { calories: 0, protein: 0, fat: 0, carbs: 0 })

    const macroCards = [
        { label: "Calories", eaten: eaten.calories, goal: day.target.calories, unit: "" },
        { label: "Protein", eaten: eaten.protein, goal: day.target.protein, unit: "g" },
        { label: "Fat", eaten: eaten.fat, goal: day.target.fat, unit: "g" },
        { label: "Carbs", eaten: eaten.carbs, goal: day.target.carbs, unit: "g" },
    ]

    return (
        <div className="flex flex-col gap-8">
            <div className="flex gap-2">
                {DAY_LABELS.map((label, index) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => selectDay(index)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
                            index === dayIndex
                                ? "border-black bg-black text-white"
                                : "border-black/10 text-ink-strong/60 hover:bg-black/5"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {macroCards.map(macro => (
                    <div key={macro.label} className="flex flex-col gap-2 rounded-xl border border-black/10 p-5">
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">{macro.label}</span>
                        <span className="text-xl font-semibold text-ink-strong">
                            {macro.eaten.toLocaleString("en-US")}{macro.unit}
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

            <div className="flex max-w-2xl flex-col gap-3">
                {day.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-[0.1em] text-ink-strong/35">{meal.type} · {meal.time}</span>
                            <span className="font-semibold text-ink-strong">{meal.name}</span>
                            <span className="text-sm text-ink-strong/40">
                                {meal.calories} kcal · {meal.protein}g protein · {meal.fat}g fat · {meal.carbs}g carbs
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => toggleMeal(mealIndex)}
                            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${
                                logged[mealIndex]
                                    ? "border-black bg-black text-white"
                                    : "border-black/10 text-ink-strong/60 hover:bg-black/5"
                            }`}
                        >
                            {logged[mealIndex] ? "Logged" : "Log"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NutritionDemo
