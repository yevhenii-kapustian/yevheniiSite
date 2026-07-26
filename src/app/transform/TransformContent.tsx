'use client'

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import dynamic from "next/dynamic"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { babes } from "@/app/fonts"
import Button from "@/components/Button"
import { getBodyGoalResult, type Gender } from "@/utils/bodyGoal"
import BodyAvatarErrorBoundary from "@/components/BodyAvatar/ErrorBoundary"

const BodyAvatar = dynamic(() => import("@/components/BodyAvatar"), { ssr: false })

const PHYSIQUE_STEPS = ["Lean", "Average", "Bulky"] as const

const bodyTypeLabel = (step: number) => PHYSIQUE_STEPS[step]

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

const TransformContent = () => {
    const [gender, setGender] = useState<Gender>("male")
    const [height, setHeight] = useState(178)
    const [weight, setWeight] = useState(80)
    const [age, setAge] = useState(28)
    const [physiqueStep, setPhysiqueStep] = useState(1)
    const sliderValue = physiqueStep * 50

    const result = useMemo(
        () => getBodyGoalResult({ gender, heightCm: height, weightKg: weight, age }, sliderValue),
        [gender, height, weight, age, sliderValue]
    )

    const statValues: Record<typeof statFields[number]["key"], number> = { age, height, weight }
    const statSetters: Record<typeof statFields[number]["key"], (value: number) => void> = {
        age: setAge,
        height: setHeight,
        weight: setWeight,
    }

    useEffect(() => {
        const resetScroll = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" })
        }

        window.addEventListener("orientationchange", resetScroll)
        return () => window.removeEventListener("orientationchange", resetScroll)
    }, [])

    return (
        <main className="transform-page relative px-5 py-10 text-ink-strong sm:px-10 sm:py-16 lg:px-20 lg:py-20">
            <div className="relative mx-auto max-w-6xl">
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mx-auto flex max-w-xl flex-col items-center gap-3 text-center"
                >
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-ink-strong/35">See your goal</span>
                    <h1 className={`${babes.className} text-5xl sm:text-6xl leading-[0.95] text-ink-strong`}>
                        See The Body You&apos;re Building
                    </h1>
                    <p className="max-w-sm text-sm text-ink-strong/50">
                        Enter your stats, then drag the slider to see the physique you&apos;re aiming for.
                    </p>
                </motion.div>

                <div className="relative mt-8 grid gap-8 sm:mt-12 lg:mt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                        className="relative"
                    >
                        <div
                            aria-hidden
                            className="absolute inset-0 -z-10"
                        />
                        <div
                            aria-hidden
                            className="absolute inset-x-16 bottom-3 h-7 rounded-[100%] bg-black/[0.08] blur-xl sm:bottom-6"
                        />
                        <div className="transform-avatar-frame relative w-full">
                            <BodyAvatarErrorBoundary>
                                <BodyAvatar sliderValue={sliderValue} gender={gender} />
                            </BodyAvatarErrorBoundary>
                        </div>
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1/2 top-0 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.3em] text-ink-strong/35"
                        >
                            {bodyTypeLabel(physiqueStep)}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="flex flex-col gap-3">
                            <span className="text-xs font-medium uppercase tracking-[0.25em] text-ink-strong/35">Gender</span>
                            <div className="relative flex w-fit rounded-full border border-black/10 p-1">
                                <motion.div
                                    className="absolute inset-y-1 left-1 w-[84px] rounded-full bg-black"
                                    animate={{ x: gender === "male" ? 0 : 84 }}
                                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setGender("male")}
                                    className={`relative z-10 w-[84px] rounded-full py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${gender === "male" ? "text-white" : "text-ink-strong/40"}`}
                                >
                                    Male
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setGender("female")}
                                    className={`relative z-10 w-[84px] rounded-full py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${gender === "female" ? "text-white" : "text-ink-strong/40"}`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 border-t border-black/10 pt-6">
                            {statFields.map(field => (
                                <div key={field.key} className="flex flex-col gap-1">
                                    <label className="text-xs font-medium uppercase tracking-[0.2em] text-ink-strong/35">{field.label}</label>
                                    <input
                                        type="number"
                                        value={statValues[field.key]}
                                        onChange={e => statSetters[field.key](Number(e.target.value))}
                                        className="border-b border-black/10 bg-transparent pb-1.5 text-lg text-ink-strong outline-none transition-colors duration-200 focus:border-black/40"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-2 border-t border-black/10 pt-6">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium uppercase tracking-[0.25em] text-ink-strong/35">Desired physique</label>
                                <span className="text-sm font-medium text-ink-strong">{bodyTypeLabel(physiqueStep)}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={2}
                                step={1}
                                value={physiqueStep}
                                onChange={e => setPhysiqueStep(Number(e.target.value))}
                                className="transform-slider mt-1"
                                style={{ "--range-progress": `${(physiqueStep / 2) * 100}%` } as CSSProperties}
                            />
                            <div className="flex justify-between text-xs text-ink-strong/35">
                                <span>Lean</span>
                                <span>Average</span>
                                <span>Bulky</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-black/10 pt-6">
                            <span className="text-xs font-medium uppercase tracking-[0.25em] text-ink-strong/35">{result.focus}</span>
                            <p className={`${babes.className} text-6xl leading-[0.95] text-ink-strong`}>
                                <AnimatedNumber value={result.calories} />
                                <span className="ml-2 text-lg font-normal tracking-normal text-ink-strong/40">kcal / day</span>
                            </p>
                            <p className="text-sm text-ink-strong/55">
                                A program built around {result.programDescription}.
                            </p>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-3 w-full sm:w-fit">
                                <Button href="/programs/the-fuel-plan" variant="solid" size="sm" className="w-full sm:w-auto">
                                    Get This Plan
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}

export default TransformContent
