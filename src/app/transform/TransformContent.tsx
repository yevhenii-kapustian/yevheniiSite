'use client'

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { babes } from "@/app/fonts"
import Button from "@/components/Button"
import { getBodyGoalResult, type Gender } from "@/utils/bodyGoal"
import BodyAvatarErrorBoundary from "@/components/BodyAvatar/ErrorBoundary"

const BodyAvatar = dynamic(() => import("@/components/BodyAvatar"), { ssr: false })

const bodyTypeLabel = (value: number) => {
    if (value < 40) return "Lean"
    if (value > 60) return "Bulky"
    return "Average"
}

const TransformContent = () => {
    const [gender, setGender] = useState<Gender>("male")
    const [height, setHeight] = useState(178)
    const [weight, setWeight] = useState(80)
    const [age, setAge] = useState(28)
    const [sliderValue, setSliderValue] = useState(50)

    const result = useMemo(
        () => getBodyGoalResult({ gender, heightCm: height, weightKg: weight, age }, sliderValue),
        [gender, height, weight, age, sliderValue]
    )

    return (
        <section className="px-5 sm:px-10 lg:px-20 py-16">
            <motion.div
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto flex max-w-5xl flex-col items-start gap-3 text-left"
            >
                <span className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-ink-strong/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-ink-strong/60" />
                    See your goal
                </span>
                <h1 className={`${babes.className} text-5xl sm:text-6xl leading-[0.95] text-ink-strong`}>Visualize Your Transformation</h1>
                <p className="max-w-lg text-sm sm:text-base text-ink-strong/70">
                    Enter your stats, then drag the slider to see the physique you&apos;re aiming for — and exactly what it&apos;ll take to get there.
                </p>
            </motion.div>

            <div className="mx-auto mt-12 flex max-w-5xl flex-col gap-10 md:flex-row md:items-start">
                <div className="h-[420px] w-full overflow-hidden md:h-[520px] md:w-[45%]">
                    <BodyAvatarErrorBoundary>
                        <BodyAvatar sliderValue={sliderValue} />
                    </BodyAvatarErrorBoundary>
                </div>

                <div className="flex w-full flex-col gap-6 md:w-[55%]">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-ink-strong/50">Gender</label>
                            <div className="flex rounded-full border border-black/10 p-1">
                                <button
                                    type="button"
                                    onClick={() => setGender("male")}
                                    className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors duration-200 ${gender === "male" ? "bg-black text-white" : "text-ink-strong/60"}`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender("female")}
                                    className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors duration-200 ${gender === "female" ? "bg-black text-white" : "text-ink-strong/60"}`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-ink-strong/50">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={e => setAge(Number(e.target.value))}
                                className="rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/30"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-ink-strong/50">Height (cm)</label>
                            <input
                                type="number"
                                value={height}
                                onChange={e => setHeight(Number(e.target.value))}
                                className="rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/30"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-ink-strong/50">Weight (kg)</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={e => setWeight(Number(e.target.value))}
                                className="rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-black/30"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold uppercase tracking-wide text-ink-strong/50">Desired physique</label>
                            <span className="text-sm font-semibold text-ink-strong">{bodyTypeLabel(sliderValue)}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            value={sliderValue}
                            onChange={e => setSliderValue(Number(e.target.value))}
                            className="w-full accent-black"
                        />
                        <div className="flex justify-between text-xs text-ink-strong/40">
                            <span>Lean</span>
                            <span>Average</span>
                            <span>Bulky</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-3xl border border-black/5 bg-surface-muted p-6">
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-strong/50">To become like this, you need</span>
                        <p className={`${babes.className} text-4xl leading-[0.95] text-ink-strong`}>{result.calories} kcal/day</p>
                        <p className="text-sm text-ink-strong/70">
                            A program focused on <strong className="text-ink-strong">{result.focus.toLowerCase()}</strong> — {result.programDescription}.
                        </p>
                        <Button href="/get-started" variant="solid" size="sm" className="mt-2 w-full sm:w-auto">
                            Get This Plan
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TransformContent
