import { useEffect, useMemo, useState, type CSSProperties } from "react"
import dynamic from "next/dynamic"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Button from "@/components/Button"
import { getBodyGoalResult, type Gender } from "@/utils/bodyGoal"
import BodyAvatarErrorBoundary from "@/components/BodyAvatar/ErrorBoundary"
import type { QuizAnswers } from "@/types/form"

const BodyAvatar = dynamic(() => import("@/components/BodyAvatar"), { ssr: false })

const PHYSIQUE_STEPS = ["Lean", "Average", "Bulky"] as const

const bodyTypeLabel = (step: number) => PHYSIQUE_STEPS[step]

const goalForSlider = (sliderValue: number): string => {
    if (sliderValue < 40) return "fat_loss"
    if (sliderValue > 60) return "muscle_gain"
    return "maintenance"
}

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

type BodyStatsStepProps = {
    onNext: (values: QuizAnswers) => void
}

const BodyStatsStep = ({ onNext }: BodyStatsStepProps) => {
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

    const handleContinue = () => {
        onNext({
            gender,
            age: String(age),
            height: String(height),
            weight: String(weight),
            goal: goalForSlider(sliderValue),
        })
    }

    return (
        <div className="transform-page relative">
            <div className="relative mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
                <div className="relative">
                    <div
                        aria-hidden
                        className="absolute inset-x-16 bottom-3 h-7 rounded-[100%] bg-white/[0.06] blur-xl sm:bottom-6"
                    />
                    <div className="transform-avatar-frame relative w-full">
                        <BodyAvatarErrorBoundary>
                            <BodyAvatar sliderValue={sliderValue} gender={gender} />
                        </BodyAvatarErrorBoundary>
                    </div>
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-1/2 top-0 -translate-x-1/2 text-xs font-medium uppercase tracking-[0.3em] text-white/35"
                    >
                        {bodyTypeLabel(physiqueStep)}
                    </motion.div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/35">Gender</span>
                        <div className="relative flex w-fit rounded-full border border-white/15 p-1">
                            <motion.div
                                className="absolute inset-y-1 left-1 w-[84px] rounded-full bg-white"
                                animate={{ x: gender === "male" ? 0 : 84 }}
                                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                            />
                            <button
                                type="button"
                                onClick={() => setGender("male")}
                                className={`relative z-10 w-[84px] rounded-full py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${gender === "male" ? "text-black" : "text-white/40"}`}
                            >
                                Male
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender("female")}
                                className={`relative z-10 w-[84px] rounded-full py-2 text-sm font-semibold transition-colors duration-200 cursor-pointer ${gender === "female" ? "text-black" : "text-white/40"}`}
                            >
                                Female
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
                        {statFields.map(field => (
                            <div key={field.key} className="flex flex-col gap-1">
                                <label className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">{field.label}</label>
                                <input
                                    type="number"
                                    value={statValues[field.key]}
                                    onChange={e => statSetters[field.key](Number(e.target.value))}
                                    className="border-b border-white/15 bg-transparent pb-1.5 text-lg text-white outline-none transition-colors duration-200 focus:border-white/40"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/10 pt-6">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-medium uppercase tracking-[0.25em] text-white/35">Desired physique</label>
                            <span className="text-sm font-medium text-white">{bodyTypeLabel(physiqueStep)}</span>
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
                        <div className="flex justify-between text-xs text-white/35">
                            <span>Lean</span>
                            <span>Average</span>
                            <span>Bulky</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-white/10 pt-6">
                        <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/35">{result.focus}</span>
                        <p className="text-5xl font-semibold leading-[0.95] text-white">
                            <AnimatedNumber value={result.calories} />
                            <span className="ml-2 text-lg font-normal tracking-normal text-white/40">kcal / day</span>
                        </p>
                        <p className="text-sm text-white/55">
                            A program built around {result.programDescription}.
                        </p>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-3 w-full sm:w-fit">
                            <Button variant="solid-light" size="sm" className="w-full sm:w-auto" onClick={handleContinue}>
                                Continue
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BodyStatsStep
