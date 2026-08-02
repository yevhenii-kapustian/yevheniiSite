type IntakeRow = {
    logged_date: string
    calories: number
}

export type AdherenceDay = {
    date: string
    calories: number
    onTarget: boolean
}

const TOLERANCE_RATIO = 0.1

export const getDailyCalories = (intake: IntakeRow[]): Map<string, number> => {
    const caloriesByDate = new Map<string, number>()
    for (const row of intake) {
        caloriesByDate.set(row.logged_date, (caloriesByDate.get(row.logged_date) ?? 0) + row.calories)
    }
    return caloriesByDate
}

export const getAdherenceDays = (intake: IntakeRow[], targetCalories: number, days = 28): AdherenceDay[] => {
    const caloriesByDate = getDailyCalories(intake)
    const lowerBound = targetCalories * (1 - TOLERANCE_RATIO)
    const upperBound = targetCalories * (1 + TOLERANCE_RATIO)

    const today = new Date()
    const result: AdherenceDay[] = []

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today)
        d.setDate(d.getDate() - i)
        const date = d.toISOString().slice(0, 10)
        const calories = caloriesByDate.get(date) ?? 0

        result.push({
            date,
            calories,
            onTarget: calories > 0 && calories >= lowerBound && calories <= upperBound,
        })
    }

    return result
}

export const getAdherenceRate = (days: AdherenceDay[]): number => {
    const logged = days.filter(d => d.calories > 0)
    if (logged.length === 0) return 0
    const onTarget = logged.filter(d => d.onTarget).length
    return Math.round((onTarget / logged.length) * 100)
}
