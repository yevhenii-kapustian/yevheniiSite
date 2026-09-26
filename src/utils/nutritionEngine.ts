export type Goal = "fat_loss" | "muscle_gain" | "maintenance"

type NutritionInput = {
    gender: string
    age: number
    heightCm: number
    weightKg: number
    goal: Goal
    activityLevel: string
    accountsForTraining: boolean
}

export type NutritionResult = {
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

const ACTIVITY_MULTIPLIERS: Record<string, number> = {
    "Mostly sitting": 1.2,
    "On my feet a lot": 1.375,
    "Physically demanding job": 1.55,
}

const DEFAULT_ACTIVITY_MULTIPLIER = 1.375
const TRAINING_LOAD_BUMP = 0.175

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

// A flat kcal deficit/surplus doesn't scale with the person it's applied to — 450kcal is a
// brutal ~30% cut for a small, sedentary person (well past the ~20-25% ceiling generally
// considered sustainable) but a mild, likely-too-slow ~15% cut for someone with a much
// higher TDEE. Sizing it as a % of TDEE instead keeps the aggressiveness consistent across
// body sizes; the min/max clamp keeps it inside a safe absolute range at either extreme
// (a very low TDEE doesn't get a near-zero deficit, a very high TDEE doesn't get pushed
// into an extreme one).
const FAT_LOSS_DEFICIT_PCT = 0.2
const FAT_LOSS_DEFICIT_RANGE = { min: 300, max: 750 }
const MUSCLE_GAIN_SURPLUS_PCT = 0.12
const MUSCLE_GAIN_SURPLUS_RANGE = { min: 200, max: 500 }

// A generous but finite ceiling — no real adult needs more than this, so it exists purely
// as a backstop against a formula blowing up from an extreme (if still validly in-range)
// combination of inputs, e.g. a very heavy, very young, very active person stacked with a
// muscle_gain surplus.
const MAX_CALORIES_CEILING = 6000

export const calculateNutritionTargets = (input: NutritionInput): NutritionResult => {
    const bmr = input.gender === "male"
        ? 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + 5
        : 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age - 161

    const baseMultiplier = ACTIVITY_MULTIPLIERS[input.activityLevel] ?? DEFAULT_ACTIVITY_MULTIPLIER
    const multiplier = baseMultiplier + (input.accountsForTraining ? TRAINING_LOAD_BUMP : 0)
    const tdee = bmr * multiplier

    const calories = input.goal === "fat_loss"
        ? tdee - clamp(tdee * FAT_LOSS_DEFICIT_PCT, FAT_LOSS_DEFICIT_RANGE.min, FAT_LOSS_DEFICIT_RANGE.max)
        : input.goal === "muscle_gain"
            ? tdee + clamp(tdee * MUSCLE_GAIN_SURPLUS_PCT, MUSCLE_GAIN_SURPLUS_RANGE.min, MUSCLE_GAIN_SURPLUS_RANGE.max)
            : tdee

    const cappedCalories = Math.min(calories, MAX_CALORIES_CEILING)

    const proteinG = Math.round(input.weightKg * (input.goal === "fat_loss" ? 2.2 : 1.8))
    const fatG = Math.round(input.weightKg * 0.8)
    const remainingCalories = cappedCalories - (proteinG * 4 + fatG * 9)
    const carbsG = Math.max(Math.round(remainingCalories / 4), 0)

    return {
        calories: Math.round(cappedCalories),
        proteinG,
        fatG,
        carbsG,
    }
}
