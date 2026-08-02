export type Effort = "easy" | "moderate" | "hard" | "failed"

export type ProgressionTarget = {
    weightKg: number
    reps: number
}

// How much weight to add when every set of the day was rated "easy".
// Smaller equipment increments move in smaller jumps than barbells.
const WEIGHT_INCREMENT_KG: Record<string, number> = {
    Bodyweight: 0,
    Dumbbell: 1,
    Cable: 2,
    Machine: 2,
    Barbell: 2.5,
}

const roundToHalf = (value: number) => Math.round(value * 2) / 2

// Called once a day's worth of sets has been logged for one exercise. Looks at the
// effort rating of every set that day and nudges next time's target up, down, or
// holds it steady — this is what actually makes the plan progressive over time
// instead of every session targeting the same weight/reps forever.
export const computeProgression = (
    todaysEfforts: Effort[],
    current: ProgressionTarget,
    equipment: string | null
): ProgressionTarget => {
    const isBodyweight = !equipment || equipment === "Bodyweight" || current.weightKg === 0
    const hasFailed = todaysEfforts.includes("failed")
    const hasHard = todaysEfforts.includes("hard")
    const allEasy = todaysEfforts.length > 0 && todaysEfforts.every(effort => effort === "easy")

    if (hasFailed) {
        return isBodyweight
            ? { weightKg: current.weightKg, reps: Math.max(current.reps - 1, 5) }
            : { weightKg: Math.max(roundToHalf(current.weightKg * 0.9), 0), reps: current.reps }
    }

    if (hasHard) {
        return current
    }

    if (allEasy) {
        return isBodyweight
            ? { weightKg: current.weightKg, reps: current.reps + 1 }
            : { weightKg: current.weightKg + (WEIGHT_INCREMENT_KG[equipment ?? ""] ?? 0), reps: current.reps }
    }

    // Only "moderate" ratings, no "hard" — solid effort, but not a clear green light
    // to add load yet. Hold steady rather than progressing on an ambiguous signal.
    return current
}
