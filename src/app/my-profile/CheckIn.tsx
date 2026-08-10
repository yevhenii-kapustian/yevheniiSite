'use client'

import { useEffect, useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { calculateNutritionTargets, type Goal } from "@/utils/nutritionEngine"
import type { Gender } from "@/utils/bodyGoal"
import BodyAvatarErrorBoundary from "@/components/BodyAvatar/ErrorBoundary"

const BodyAvatar = dynamic(() => import("@/components/BodyAvatar"), { ssr: false })

const GOAL_SLIDER_VALUE: Record<Goal, number> = {
    fat_loss: 15,
    maintenance: 50,
    muscle_gain: 85,
}

const GOALS: { value: Goal, label: string }[] = [
    { value: "fat_loss", label: "Lose fat" },
    { value: "maintenance", label: "Maintain" },
    { value: "muscle_gain", label: "Build muscle" },
]

const statFields = [
    { key: "age", label: "Age", min: 13, max: 100 },
    { key: "height", label: "Height, cm", min: 100, max: 250 },
    { key: "weight", label: "Weight, kg", min: 30, max: 300 },
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
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-semibold tracking-tight text-ink-strong">Your stats & goal</h1>
            </div>

            <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
                <div className="relative">
                    <div className="relative h-[300px] w-full sm:h-[380px] lg:h-[440px]">
                        <BodyAvatarErrorBoundary>
                            <BodyAvatar sliderValue={GOAL_SLIDER_VALUE[goal]} gender={gender}/>
                        </BodyAvatarErrorBoundary>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ink-strong/35">Gender</span>
                        <div className="relative flex w-fit rounded-full bg-black/[0.045] p-1">
                            <motion.div
                                className="absolute inset-y-1 left-1 w-[84px] rounded-full bg-black"
                                animate={{ x: gender === "male" ? 0 : 84 }}
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                            />
                            <button
                                type="button"
                                onClick={() => setGender("male")}
                                className={`relative z-10 w-[84px] rounded-full py-2 text-sm font-semibold transition-colors duration-200 ${gender === "male" ? "text-white" : "text-ink-strong/50"}`}
                            >
                                Male
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender("female")}
                                className={`relative z-10 w-[84px] rounded-full py-2 text-sm font-semibold transition-colors duration-200 ${gender === "female" ? "text-white" : "text-ink-strong/50"}`}
                            >
                                Female
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 border-t border-black/[0.05] pt-5">
                        {statFields.map(field => (
                            <div key={field.key} className="flex flex-col gap-1.5 rounded-2xl bg-black/[0.03] px-3 py-2.5">
                                <label className="text-[11px] font-medium uppercase tracking-[0.1em] text-ink-strong/35">{field.label}</label>
                                <input
                                    type="number"
                                    min={field.min}
                                    max={field.max}
                                    value={statValues[field.key]}
                                    onChange={e => statSetters[field.key](Number(e.target.value))}
                                    className="w-full bg-transparent text-lg font-semibold text-ink-strong outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-black/[0.05] pt-5">
                        <label className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Goal</label>
                        <div className="flex flex-wrap gap-2">
                            {GOALS.map(g => (
                                <button
                                    key={g.value}
                                    type="button"
                                    onClick={() => setGoal(g.value)}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${goal === g.value ? "bg-black text-white" : "bg-black/[0.045] text-ink-strong/60 hover:bg-black/[0.08]"}`}
                                >
                                    {g.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 border-t border-black/[0.05] pt-5">
                        <p className="text-4xl font-semibold tracking-tight text-ink-strong">
                            <AnimatedNumber value={result.calories}/>
                            <span className="ml-2 text-base font-normal text-ink-strong/40">kcal / day</span>
                        </p>
                        <p className="text-sm text-ink-strong/55">
                            {result.proteinG}g protein · {result.fatG}g fat · {result.carbsG}g carbs
                        </p>

                        <button
                            type="button"
                            onClick={handleContinue}
                            disabled={saving}
                            className="mt-3 w-full rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckIn
