export type Gender = "male" | "female"

export type BodyStats = {
    gender: Gender
    heightCm: number
    weightKg: number
    age: number
}

export type BodyGoalResult = {
    calories: number
    focus: "Fat loss" | "Recomposition" | "Hypertrophy"
    programDescription: string
}

const ACTIVITY_MULTIPLIER = 1.45

// Mirrors the deficit/surplus sizing in nutritionEngine.ts (the real, post-signup
// calculation) — this is a pre-signup preview shown on the marketing quiz, and it used to
// use flatly different fixed-kcal numbers, so the numbers shown here could quietly diverge
// from what a user actually gets right after paying. Same %-of-TDEE-with-clamp approach,
// same clamp ranges, kept as separate constants only because this preview doesn't know
// activity level yet (uses one flat multiplier) or accounts-for-training.
const FAT_LOSS_DEFICIT_PCT = 0.2
const FAT_LOSS_DEFICIT_RANGE = { min: 300, max: 750 }
const MUSCLE_GAIN_SURPLUS_PCT = 0.12
const MUSCLE_GAIN_SURPLUS_RANGE = { min: 200, max: 500 }

// Same backstop as MAX_CALORIES_CEILING in nutritionEngine.ts — without it, the quiz's own
// input bounds (weight up to 300kg, height up to 250cm) can still produce a TDEE north of
// 6000kcal, which this preview would show uncapped even though the real post-signup
// calculation caps at the same number — exactly the "preview quietly diverges from what you
// actually get" gap this file's %-of-TDEE rework was meant to close.
const MAX_CALORIES_CEILING = 6000

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const calculateTDEE = ({ gender, heightCm, weightKg, age }: BodyStats): number => {
    const bmr = gender === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161

    return bmr * ACTIVITY_MULTIPLIER
}

export const getBodyGoalResult = (stats: BodyStats, sliderValue: number): BodyGoalResult => {
    const tdee = calculateTDEE(stats)

    if (sliderValue < 40) {
        return {
            calories: Math.round(tdee - clamp(tdee * FAT_LOSS_DEFICIT_PCT, FAT_LOSS_DEFICIT_RANGE.min, FAT_LOSS_DEFICIT_RANGE.max)),
            focus: "Fat loss",
            programDescription: "a calorie deficit paired with strength training to lose fat while holding onto muscle",
        }
    }

    if (sliderValue > 60) {
        return {
            calories: Math.round(tdee + clamp(tdee * MUSCLE_GAIN_SURPLUS_PCT, MUSCLE_GAIN_SURPLUS_RANGE.min, MUSCLE_GAIN_SURPLUS_RANGE.max)),
            focus: "Hypertrophy",
            programDescription: "a calorie surplus paired with a progressive strength training split focused on muscle growth",
        }
    }

    return {
        calories: Math.round(tdee),
        focus: "Recomposition",
        programDescription: "maintenance calories paired with a balanced strength and conditioning program",
    }
}
