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
            calories: Math.round(tdee - 400),
            focus: "Fat loss",
            programDescription: "a calorie deficit paired with strength training to lose fat while holding onto muscle",
        }
    }

    if (sliderValue > 60) {
        return {
            calories: Math.round(tdee + 350),
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
