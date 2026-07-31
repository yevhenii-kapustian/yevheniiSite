'use client'

import { useEffect, useMemo, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Button from "@/components/Button"
import { calculateNutritionTargets, type Goal } from "@/utils/nutritionEngine"
import type { Gender } from "@/utils/bodyGoal"

const GOALS: { value: Goal, label: string }[] = [
    { value: "fat_loss", label: "Lose fat" },
    { value: "maintenance", label: "Maintain" },
    { value: "muscle_gain", label: "Build muscle" },
]

const statFields = [
    { key: "age", label: "Age" },
    { key: "height", label: "Height, cm" },
    { key: "weight", label: "Weight, kg" },
] as const

const AnimatedNumber = ({ value }: { value: number }) => {
    const motionValue = useMotionValue(value)
    const spring = useSpring(motionValue, { stiffness: 90, damping: 20 })
    const rounded = useTransform(spring, latest => Math.round(latest).toLocaleString("en-US"))

    useEffect(() => {
        motionValue.set(value)
    }, [value, motionValue])

    return <motion.span>{rounded}</motion.span>
}

export type CheckInValues = {
    gender: Gender
    age: number
    height: number
    weight: number
    goal: Goal
}

type CheckInProps = {
    initial: CheckInValues
    activityLevel: string | null
    accountsForTraining: boolean
    onContinue: (values: CheckInValues) => Promise<void>
}

const CheckIn = ({ initial, activityLevel, accountsForTraining, onContinue }: CheckInProps) => {
    const [gender, setGender] = useState<Gender>(initial.gender)
    const [height, setHeight] = useState(initial.height)
    const [weight, setWeight] = useState(initial.weight)
    const [age, setAge] = useState(initial.age)
    const [goal, setGoal] = useState<Goal>(initial.goal)
    const [saving, setSaving] = useState(false)

    const result = useMemo(
        () => calculateNutritionTargets({
            gender,
            age,
            heightCm: height,
            weightKg: weight,
            goal,
            activityLevel: activityLevel ?? "On my feet a lot",
            accountsForTraining,
        }),
        [gender, height, weight, age, goal, activityLevel, accountsForTraining]
    )

    const statValues: Record<typeof statFields[number]["key"], number> = { age, height, weight }
    const statSetters: Record<typeof statFields[number]["key"], (value: number) => void> = {
        age: setAge,
        height: setHeight,
        weight: setWeight,
    }

    const handleContinue = async () => {
        setSaving(true)
        try {
            await onContinue({ gender, age, height, weight, goal })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-medium uppercase tracking-[0.25em] text-ink-strong/35">Weekly check-in</span>
                <h1 className="text-2xl font-semibold text-ink-strong">How are things today?</h1>
            </div>

            <div className="flex w-fit rounded-full border border-black/10 p-1">
                <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-colors duration-200 ${gender === "male" ? "bg-black text-white" : "text-ink-strong/50"}`}
                >
                    Male
                </button>
                <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`rounded-full px-6 py-2 text-sm font-medium transition-colors duration-200 ${gender === "female" ? "bg-black text-white" : "text-ink-strong/50"}`}
                >
                    Female
                </button>
            </div>

            <div className="grid w-full grid-cols-3 gap-6 border-t border-black/10 pt-6">
                {statFields.map(field => (
                    <div key={field.key} className="flex flex-col items-center gap-1">
                        <label className="text-xs uppercase tracking-[0.15em] text-ink-strong/35">{field.label}</label>
                        <input
                            type="number"
                            value={statValues[field.key]}
                            onChange={e => statSetters[field.key](Number(e.target.value))}
                            className="w-full border-b border-black/10 bg-transparent pb-1.5 text-center text-lg text-ink-strong outline-none transition-colors duration-200 focus:border-black/40"
                        />
                    </div>
                ))}
            </div>

            <div className="flex w-full flex-col items-center gap-3 border-t border-black/10 pt-6">
                <label className="text-xs uppercase tracking-[0.15em] text-ink-strong/35">Goal</label>
                <div className="flex flex-wrap justify-center gap-2">
                    {GOALS.map(g => (
                        <button
                            key={g.value}
                            type="button"
                            onClick={() => setGoal(g.value)}
                            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ${goal === g.value ? "border-black bg-black text-white" : "border-black/10 text-ink-strong/60"}`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex w-full flex-col items-center gap-1 border-t border-black/10 pt-6">
                <p className="text-4xl font-semibold leading-none text-ink-strong">
                    <AnimatedNumber value={result.calories}/>
                    <span className="ml-2 text-base font-normal text-ink-strong/40">kcal / day</span>
                </p>
                <p className="text-sm text-ink-strong/55">
                    {result.proteinG}g protein · {result.fatG}g fat · {result.carbsG}g carbs
                </p>
            </div>

            <Button variant="solid" size="md" className="w-full" onClick={handleContinue} disabled={saving}>
                {saving ? "Saving…" : "Continue"}
            </Button>
        </div>
    )
}

export default CheckIn
