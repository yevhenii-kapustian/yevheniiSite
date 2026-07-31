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

export const calculateNutritionTargets = (input: NutritionInput): NutritionResult => {
    const bmr = input.gender === "male"
        ? 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + 5
        : 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age - 161

    const baseMultiplier = ACTIVITY_MULTIPLIERS[input.activityLevel] ?? DEFAULT_ACTIVITY_MULTIPLIER
    const multiplier = baseMultiplier + (input.accountsForTraining ? TRAINING_LOAD_BUMP : 0)
    const tdee = bmr * multiplier

    const calories = input.goal === "fat_loss"
        ? tdee - 450
        : input.goal === "muscle_gain"
            ? tdee + 350
            : tdee

    const proteinG = Math.round(input.weightKg * (input.goal === "fat_loss" ? 2.2 : 1.8))
    const fatG = Math.round(input.weightKg * 0.8)
    const remainingCalories = calories - (proteinG * 4 + fatG * 9)
    const carbsG = Math.max(Math.round(remainingCalories / 4), 0)

    return {
        calories: Math.round(calories),
        proteinG,
        fatG,
        carbsG,
    }
}
