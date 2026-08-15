export type ExerciseRow = {
    id: number
    name: string
    muscle_group: string
    equipment: string | null
}

export type GeneratedPlanExercise = {
    exerciseId: number
    dayOfWeek: number
    sets: number
    reps: number
    weightKg: number
}

type ProfileForPlan = {
    experience: string | null
    daysPerWeek: string | null
    equipment: string | null
    gender: string | null
    bodyWeightKg: number | null
}

const FULL_BODY_GROUPS = ["Chest", "Back", "Quads", "Glutes", "Shoulders", "Abs"]
const UPPER_GROUPS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps"]
const LOWER_GROUPS = ["Quads", "Hamstrings", "Glutes", "Calves", "Abs"]
const PUSH_GROUPS = ["Chest", "Shoulders", "Triceps"]
const PULL_GROUPS = ["Back", "Biceps"]
const LEGS_GROUPS = ["Quads", "Hamstrings", "Glutes", "Calves"]

// day_of_week follows ISO weekday numbering: 1 = Monday ... 7 = Sunday.
const SPLITS: Record<string, { dayOfWeek: number, muscleGroups: string[] }[]> = {
    "2-3": [
        { dayOfWeek: 1, muscleGroups: FULL_BODY_GROUPS },
        { dayOfWeek: 3, muscleGroups: FULL_BODY_GROUPS },
        { dayOfWeek: 5, muscleGroups: FULL_BODY_GROUPS },
    ],
    "4": [
        { dayOfWeek: 1, muscleGroups: UPPER_GROUPS },
        { dayOfWeek: 2, muscleGroups: LOWER_GROUPS },
        { dayOfWeek: 4, muscleGroups: UPPER_GROUPS },
        { dayOfWeek: 5, muscleGroups: LOWER_GROUPS },
    ],
    "5+": [
        { dayOfWeek: 1, muscleGroups: PUSH_GROUPS },
        { dayOfWeek: 2, muscleGroups: PULL_GROUPS },
        { dayOfWeek: 3, muscleGroups: LEGS_GROUPS },
        { dayOfWeek: 4, muscleGroups: PUSH_GROUPS },
        { dayOfWeek: 5, muscleGroups: PULL_GROUPS },
    ],
}

const EQUIPMENT_TIERS: Record<string, string[]> = {
    "Full gym": ["Bodyweight", "Dumbbell", "Barbell", "Cable", "Machine"],
    "Home basics": ["Bodyweight", "Dumbbell"],
    "Bodyweight only": ["Bodyweight"],
}

const EXPERIENCE_PARAMS: Record<string, { sets: number, reps: number }> = {
    "New to training": { sets: 2, reps: 12 },
    "Some experience": { sets: 3, reps: 10 },
    "Advanced": { sets: 4, reps: 8 },
}

// Full Body and Upper/Lower already spread 5-6 muscle groups across one session, so one
// exercise per group is already a full workout. Push/Pull/Legs deliberately covers far
// fewer groups per day (3 for Push/Pull, 4 for Legs) specifically so each one can get more
// than a single movement — a beginner still gets one lift per group to focus on technique,
// but anyone with real training experience expects a compound + at least one accessory
// per muscle group on a PPL split, not a single set of exercises for the whole session.
const getExercisesPerMuscleGroup = (daysPerWeek: string, experience: string): number =>
    (daysPerWeek === "5+" && experience !== "New to training") ? 2 : 1

// Isolation lifts (curls, raises, extensions...) are always lighter than compound
// lifts (squats, presses, rows...) regardless of equipment — using one flat number
// per equipment tier gave absurd results like a 60kg biceps curl.
const ISOLATION_KEYWORDS = ["Curl", "Raise", "Extension", "Fly"]
const isIsolationExercise = (name: string) => ISOLATION_KEYWORDS.some(keyword => name.includes(keyword))

const LOWER_BODY_MUSCLE_GROUPS = new Set(["Quads", "Hamstrings", "Glutes", "Calves"])

// STARTING_WEIGHT_KG is calibrated for an average-build man around 80kg — it needs
// adjusting for anyone who isn't that, otherwise a 50kg woman and a 100kg man get
// handed the identical bar weight. The upper-body strength gap between sexes is
// larger than the lower-body one on average, so they get different multipliers rather
// than one flat number. Both factors are intentionally mild (clamped) — this is still
// just a starting guess the logged-effort progression is meant to correct within a
// few sessions, not a precise prescription.
const FEMALE_STRENGTH_MULTIPLIER = { upper: 0.6, lower: 0.8 }
const BODYWEIGHT_REFERENCE_KG = 80
const BODYWEIGHT_MULTIPLIER_RANGE = { min: 0.7, max: 1.3 }

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const WEIGHT_ROUNDING_KG: Record<string, number> = {
    Barbell: 2.5,
    Dumbbell: 1,
    Cable: 2.5,
    Machine: 2.5,
}

const roundToIncrement = (value: number, equipment: string) => {
    const increment = WEIGHT_ROUNDING_KG[equipment] ?? 1
    return Math.round(value / increment) * increment
}

const adjustForBodyStats = (baseWeight: number, muscleGroup: string, equipment: string, profile: ProfileForPlan) => {
    if (baseWeight <= 0) return baseWeight

    const isLowerBody = LOWER_BODY_MUSCLE_GROUPS.has(muscleGroup)
    const genderMultiplier = profile.gender === "female"
        ? (isLowerBody ? FEMALE_STRENGTH_MULTIPLIER.lower : FEMALE_STRENGTH_MULTIPLIER.upper)
        : 1
    const bodyweightMultiplier = profile.bodyWeightKg
        ? clamp(profile.bodyWeightKg / BODYWEIGHT_REFERENCE_KG, BODYWEIGHT_MULTIPLIER_RANGE.min, BODYWEIGHT_MULTIPLIER_RANGE.max)
        : 1

    return roundToIncrement(baseWeight * genderMultiplier * bodyweightMultiplier, equipment)
}

// Starting points only — the app has no 1RM data, so these are deliberately conservative.
// They're meant to be adjusted upward as the user logs real sets, not a precision estimate.
const STARTING_WEIGHT_KG: Record<string, Record<string, { compound: number, isolation: number }>> = {
    Bodyweight: {
        "New to training": { compound: 0, isolation: 0 },
        "Some experience": { compound: 0, isolation: 0 },
        "Advanced": { compound: 0, isolation: 0 },
    },
    Dumbbell: {
        "New to training": { compound: 8, isolation: 4 },
        "Some experience": { compound: 14, isolation: 8 },
        "Advanced": { compound: 22, isolation: 14 },
    },
    Barbell: {
        "New to training": { compound: 30, isolation: 15 },
        "Some experience": { compound: 55, isolation: 25 },
        "Advanced": { compound: 90, isolation: 40 },
    },
    Cable: {
        "New to training": { compound: 15, isolation: 8 },
        "Some experience": { compound: 25, isolation: 15 },
        "Advanced": { compound: 40, isolation: 25 },
    },
    Machine: {
        "New to training": { compound: 20, isolation: 10 },
        "Some experience": { compound: 35, isolation: 20 },
        "Advanced": { compound: 55, isolation: 30 },
    },
}

const SPLIT_LABELS: Record<string, string> = {
    "2-3": "Full Body",
    "4": "Upper / Lower",
    "5+": "Push / Pull / Legs",
}

export const getSplitLabel = (daysPerWeek: string | null): string =>
    (daysPerWeek && SPLIT_LABELS[daysPerWeek]) ? SPLIT_LABELS[daysPerWeek] : SPLIT_LABELS["2-3"]

// A stable per-week key (YYYYWW) so a new plan is generated once per calendar week,
// consistently, regardless of when in the week the user happens to log in.
export const getISOWeekKey = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7)
    return d.getUTCFullYear() * 100 + week
}

export type PreviousTarget = { weightKg: number, reps: number }

type GenerateOptions = {
    // Shifts which exercise in each muscle group's pool a week starts from, so the same
    // slot doesn't pick the identical exercise week after week (see getISOWeekKey).
    rotationOffset?: number
    // Last known weight/reps per exercise ID, from any earlier week — lets progression
    // carry over even when an exercise drops out of rotation and comes back later.
    previousTargets?: Map<number, PreviousTarget>
}

export const generateTrainingPlan = (
    profile: ProfileForPlan,
    exercises: ExerciseRow[],
    options: GenerateOptions = {}
): GeneratedPlanExercise[] => {
    const experience = profile.experience && EXPERIENCE_PARAMS[profile.experience] ? profile.experience : "Some experience"
    const daysPerWeek = profile.daysPerWeek && SPLITS[profile.daysPerWeek] ? profile.daysPerWeek : "2-3"
    const equipmentTier = profile.equipment && EQUIPMENT_TIERS[profile.equipment] ? profile.equipment : "Full gym"
    const rotationOffset = options.rotationOffset ?? 0
    const previousTargets = options.previousTargets ?? new Map<number, PreviousTarget>()

    const allowedEquipment = new Set(EQUIPMENT_TIERS[equipmentTier])
    const { sets: baseSets, reps } = EXPERIENCE_PARAMS[experience]
    const exercisesPerGroup = getExercisesPerMuscleGroup(daysPerWeek, experience)
    // Splitting the same target volume across more than one exercise per group — one set
    // fewer each so the total per muscle group doesn't just double outright.
    const setsPerExercise = exercisesPerGroup > 1 ? Math.max(baseSets - 1, 2) : baseSets

    const exercisesByMuscleGroup = new Map<string, ExerciseRow[]>()
    for (const exercise of exercises) {
        if (!exercise.equipment || !allowedEquipment.has(exercise.equipment)) continue
        const list = exercisesByMuscleGroup.get(exercise.muscle_group) ?? []
        list.push(exercise)
        exercisesByMuscleGroup.set(exercise.muscle_group, list)
    }

    const result: GeneratedPlanExercise[] = []
    const usedIndexByGroup = new Map<string, number>()

    for (const day of SPLITS[daysPerWeek]) {
        for (const muscleGroup of day.muscleGroups) {
            const pool = exercisesByMuscleGroup.get(muscleGroup)
            if (!pool || pool.length === 0) continue

            const slotsThisGroup = Math.min(exercisesPerGroup, pool.length)

            for (let slot = 0; slot < slotsThisGroup; slot++) {
                // Cycle through the pool across repeated days within the week (e.g. Mon/Wed/Fri
                // full body) and across multiple slots on the same day, starting from a
                // week-dependent offset so different weeks land on different exercises for
                // the same slot instead of always picking index 0.
                const usedIndex = usedIndexByGroup.get(muscleGroup) ?? rotationOffset
                const exercise = pool[usedIndex % pool.length]
                usedIndexByGroup.set(muscleGroup, usedIndex + 1)

                const previous = previousTargets.get(exercise.id)
                const weightTier = STARTING_WEIGHT_KG[exercise.equipment!]?.[experience]
                const baseWeight = weightTier ? (isIsolationExercise(exercise.name) ? weightTier.isolation : weightTier.compound) : 0
                const defaultWeight = adjustForBodyStats(baseWeight, muscleGroup, exercise.equipment!, profile)

                result.push({
                    exerciseId: exercise.id,
                    dayOfWeek: day.dayOfWeek,
                    sets: setsPerExercise,
                    reps: previous?.reps ?? reps,
                    weightKg: previous?.weightKg ?? defaultWeight,
                })
            }
        }
    }

    return result
}
