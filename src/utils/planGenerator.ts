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

export type ProfileForPlan = {
    experience: string | null
    daysPerWeek: string | null
    equipment: string | null
    gender: string | null
    bodyWeightKg: number | null
    goal: string | null
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

// Sets scale with experience (more work capacity = more volume tolerated). Reps scale
// with goal instead — a fat-loss and a muscle-gain user with identical experience should
// still train in different rep ranges; experience alone doesn't determine that.
const SETS_BY_EXPERIENCE: Record<string, number> = {
    "New to training": 2,
    "Some experience": 3,
    "Advanced": 4,
}

const REPS_BY_GOAL: Record<string, number> = {
    fat_loss: 14,
    muscle_gain: 9,
    maintenance: 10,
}
const DEFAULT_REPS = 10

// Full Body and Upper/Lower already spread 5-6 muscle groups across one session, so one
// exercise per group is already a full workout there. Push/Pull/Legs deliberately covers
// fewer groups per day specifically so each one can get more than a single movement — a
// beginner still gets one lift per group to focus on technique, but anyone with real
// training experience expects more on a PPL split. Not every group gets the same bump
// though: Back works through several distinct planes (vertical pull, horizontal row, hip
// hinge) and responds to more variety than a small single-joint group like biceps, so it
// gets a third slot. Legs covers four groups at once (quads/hamstrings/glutes/calves), so
// doubling every one of them into a second EXERCISE would mean 8 exercises in one session —
// they stay at one exercise each, but (see LEGS_SET_BONUS below) get extra SETS on that one
// exercise instead, since on the 5+ split Legs only trains once a week while Push/Pull each
// train twice — without a bonus, weekly leg volume would land far below every other group's
// and below even a beginner's full-body leg volume.
const PPL_EXERCISES_PER_GROUP: Record<string, number> = {
    Back: 3,
}
const DEFAULT_PPL_EXERCISES_PER_GROUP = 2
const LEGS_HIGH_GROUP_COUNT = new Set(["Quads", "Hamstrings", "Glutes", "Calves"])

const getExercisesPerMuscleGroup = (daysPerWeek: string, experience: string, muscleGroup: string): number => {
    if (daysPerWeek !== "5+" || experience === "New to training" || LEGS_HIGH_GROUP_COUNT.has(muscleGroup)) return 1
    return PPL_EXERCISES_PER_GROUP[muscleGroup] ?? DEFAULT_PPL_EXERCISES_PER_GROUP
}

// Extra sets added directly onto the single leg-day exercise (see comment above) — sized
// by experience like everything else, and scaled up a bit more than a flat +N would be
// since Advanced lifters get the least benefit from a token bump. Not applied to "New to
// training" via getExercisesPerMuscleGroup's split-in-general 1-exercise floor already
// covering beginners; giving legs an outsized bonus specifically for them would push a
// single session's volume past what someone still learning the squat pattern should be
// doing in one sitting.
const LEGS_SET_BONUS: Record<string, number> = {
    "New to training": 2,
    "Some experience": 3,
    "Advanced": 4,
}

// Isolation lifts (curls, raises, extensions...) are always lighter than compound
// lifts (squats, presses, rows...) regardless of equipment — using one flat number
// per equipment tier gave absurd results like a 60kg biceps curl.
const ISOLATION_KEYWORDS = ["Curl", "Raise", "Extension", "Fly"]
export const isIsolationExercise = (name: string) => ISOLATION_KEYWORDS.some(keyword => name.includes(keyword))

// When a muscle group trains twice in the same week (Push/Pull/Legs days repeat, and so
// does Upper/Lower), pulling from a single flat rotation can hand back two very similar
// sessions — e.g. two rowing-heavy back days with no vertical pulling at all. Where a
// muscle group has a genuinely distinct pair of movement patterns, the two weekly
// occurrences are biased toward opposite patterns instead: one leans width, the other
// thickness; one leans upper chest, the other overall/lower; one leans pressing, the
// other raises/rear delt. Smaller single-pattern groups (biceps, triceps, calves...)
// don't get a classifier — there's no meaningfully distinct "other pattern" to alternate
// with, so they stay on the plain rotation.
const PATTERN_KEYWORDS: Record<string, string[]> = {
    // Pattern A per group; anything not matching falls into pattern B.
    Back: ["Pull-Up", "Chin-Up", "Pulldown", "Pullover"], // A = vertical/width, B = rows + hinge/thickness
    Chest: ["Incline"], // A = upper chest, B = flat/decline/general
    Shoulders: ["Press"], // A = pressing (front delt), B = raises/face pull (side/rear delt)
    Quads: ["Squat"], // A = squat pattern, B = lunge/single-leg/machine pattern
}

// "Split Squat"/"Bulgarian Split Squat" contain the substring "Squat" but are actually the
// unilateral/lunge pattern PATTERN_KEYWORDS.Quads's "B" side is meant to catch, not the
// bilateral squat pattern "A" is — checked first so these fall through to B despite the
// substring match, otherwise the intended squat-vs-lunge alternation silently never
// triggers for these two names.
const PATTERN_B_OVERRIDE_KEYWORDS: Record<string, string[]> = {
    Quads: ["Split Squat"],
}

const getExercisePattern = (muscleGroup: string, name: string): "A" | "B" => {
    if (PATTERN_B_OVERRIDE_KEYWORDS[muscleGroup]?.some(keyword => name.includes(keyword))) return "B"
    const keywords = PATTERN_KEYWORDS[muscleGroup]
    if (!keywords) return "A"
    return keywords.some(keyword => name.includes(keyword)) ? "A" : "B"
}

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

// Not every "compound" lift is equally heavy at the same experience tier — STARTING_WEIGHT_KG
// only buckets by equipment+tier, which used to hand an Overhead Press the exact same
// squat/deadlift/bench-caliber number. That's not just imprecise, it's a genuinely
// unrealistic (bordering on unsafe, for an Advanced lifter) starting weight for a press
// that typically loads at roughly half of what those lifts do for the same person. Keyed
// by name substring and checked before the isolation/compound split, so this only trims
// specific known-lighter compound patterns rather than touching every barbell lift.
const COMPOUND_WEIGHT_MULTIPLIER: { keywords: string[], multiplier: number }[] = [
    { keywords: ["Overhead Press", "Push Press"], multiplier: 0.55 },
    { keywords: ["Barbell Row", "Pendlay Row"], multiplier: 0.65 },
    { keywords: ["Romanian Deadlift", "Good Morning"], multiplier: 0.7 },
    { keywords: ["Lunges"], multiplier: 0.5 },
]

const getCompoundWeightMultiplier = (name: string): number =>
    COMPOUND_WEIGHT_MULTIPLIER.find(entry => entry.keywords.some(keyword => name.includes(keyword)))?.multiplier ?? 1

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

// The same starting-weight calculation generateTrainingPlan uses for every exercise it
// assigns, exported so anything that hands a user a DIFFERENT exercise outside of a full
// regeneration — the exercise-swap feature, specifically — can give it a sensible weight
// instead of silently carrying over whatever the previous exercise happened to be loaded
// at (which swapPlanExercise used to do, since it only ever touched exercise_id).
export const getDefaultWeightForExercise = (exercise: { name: string, equipment: string, muscle_group: string }, profile: ProfileForPlan): number => {
    const experience = profile.experience && SETS_BY_EXPERIENCE[profile.experience] ? profile.experience : "Some experience"
    const weightTier = STARTING_WEIGHT_KG[exercise.equipment]?.[experience]
    const baseWeight = weightTier
        ? (isIsolationExercise(exercise.name) ? weightTier.isolation : weightTier.compound * getCompoundWeightMultiplier(exercise.name))
        : 0
    return adjustForBodyStats(baseWeight, exercise.muscle_group, exercise.equipment, profile)
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
    // Cuts sets and working weight back for a planned recovery week — see isDeloadWeek
    // in queries.ts for how this gets decided (every 5th week of real training).
    isDeloadWeek?: boolean
    // Position (1-4) within the 4-week block leading up to the next deload — see
    // getWeekInBlock in queries.ts. Drives a small accumulation wave (see below) rather
    // than flat, identical volume every single week until the deload hits.
    weekInBlock?: number
}

// A deload trims volume and intensity without erasing progress — next week resumes
// at the pre-deload numbers (previousTargets always looks at the most recent
// NON-deload week, see getPreviousTargetsForUser), so this can't compound into a
// permanent regression.
const DELOAD_SET_MULTIPLIER = 0.5
const DELOAD_WEIGHT_MULTIPLIER = 0.6

// Exported so swapPlanExercise can apply the same deload reduction generateTrainingPlan
// does when the current week happens to be a deload — a freshly swapped-in exercise should
// respect that, not silently reset to full working weight mid-deload-week.
export const applyDeloadToWeight = (weightKg: number, equipment: string, isDeloadWeek: boolean): number =>
    isDeloadWeek && weightKg > 0 ? roundToIncrement(weightKg * DELOAD_WEIGHT_MULTIPLIER, equipment) : weightKg

// A simple linear accumulation wave across the 4 weeks between deloads: hold baseline
// volume for the first two weeks, then add one working set on compound lifts for the
// back half as fatigue is still manageable but the body's adapted to the starting load —
// classic "ramp up, then deload" block structure, rather than every week looking
// identical until the deload suddenly cuts volume in half.
const ACCUMULATION_START_WEEK = 3
const ACCUMULATION_SET_BONUS = 1

export const generateTrainingPlan = (
    profile: ProfileForPlan,
    exercises: ExerciseRow[],
    options: GenerateOptions = {}
): GeneratedPlanExercise[] => {
    const experience = profile.experience && SETS_BY_EXPERIENCE[profile.experience] ? profile.experience : "Some experience"
    const daysPerWeek = profile.daysPerWeek && SPLITS[profile.daysPerWeek] ? profile.daysPerWeek : "2-3"
    const equipmentTier = profile.equipment && EQUIPMENT_TIERS[profile.equipment] ? profile.equipment : "Full gym"
    const rotationOffset = options.rotationOffset ?? 0
    const previousTargets = options.previousTargets ?? new Map<number, PreviousTarget>()
    const isDeloadWeek = options.isDeloadWeek ?? false
    const weekInBlock = options.weekInBlock ?? 1

    const allowedEquipment = new Set(EQUIPMENT_TIERS[equipmentTier])
    const baseSets = SETS_BY_EXPERIENCE[experience]
    const reps = profile.goal ? (REPS_BY_GOAL[profile.goal] ?? DEFAULT_REPS) : DEFAULT_REPS

    const exercisesByMuscleGroup = new Map<string, ExerciseRow[]>()
    for (const exercise of exercises) {
        if (!exercise.equipment || !allowedEquipment.has(exercise.equipment)) continue
        const list = exercisesByMuscleGroup.get(exercise.muscle_group) ?? []
        list.push(exercise)
        exercisesByMuscleGroup.set(exercise.muscle_group, list)
    }
    // Compounds first within each group's pool — when a slot rotates between multiple
    // exercises for the same muscle, you want the heavy compound lift while fresh and
    // any accessory/isolation work after it, not whichever order they happened to be
    // inserted into the exercise library in.
    for (const list of exercisesByMuscleGroup.values()) {
        list.sort((a, b) => Number(isIsolationExercise(a.name)) - Number(isIsolationExercise(b.name)))
    }

    // Which days of the week each muscle group trains on, in order — used below to tell
    // a group's first weekly occurrence from its second.
    const trainingDaysByGroup = new Map<string, number[]>()
    for (const day of SPLITS[daysPerWeek]) {
        for (const muscleGroup of day.muscleGroups) {
            const list = trainingDaysByGroup.get(muscleGroup) ?? []
            list.push(day.dayOfWeek)
            trainingDaysByGroup.set(muscleGroup, list)
        }
    }

    const result: GeneratedPlanExercise[] = []
    const usedIndexByGroup = new Map<string, number>()

    for (const day of SPLITS[daysPerWeek]) {
        for (const muscleGroup of day.muscleGroups) {
            const sortedPool = exercisesByMuscleGroup.get(muscleGroup)
            if (!sortedPool || sortedPool.length === 0) continue

            // On a group's second weekly occurrence, put the opposite movement pattern
            // first in line so it's favored over whatever pattern the first occurrence
            // already leaned on — the compound-first sort above is preserved within each
            // pattern half.
            const occurrenceDays = trainingDaysByGroup.get(muscleGroup) ?? []
            const occurrenceIndex = occurrenceDays.indexOf(day.dayOfWeek)
            const pool = PATTERN_KEYWORDS[muscleGroup] && occurrenceDays.length > 1
                ? [...sortedPool].sort((a, b) => {
                    const preferred = occurrenceIndex % 2 === 0 ? "A" : "B"
                    const aMatches = getExercisePattern(muscleGroup, a.name) === preferred ? 0 : 1
                    const bMatches = getExercisePattern(muscleGroup, b.name) === preferred ? 0 : 1
                    return aMatches - bMatches
                })
                : sortedPool

            const exercisesPerGroup = getExercisesPerMuscleGroup(daysPerWeek, experience, muscleGroup)
            // Splitting the same target volume across more than one exercise per group — one
            // set fewer each so the total per muscle group doesn't just double outright.
            // Only on the 5+/PPL split does Legs train just once a week (Full Body and
            // Upper/Lower already hit it 2-3x/week on their own) — that's the only case
            // LEGS_SET_BONUS applies to, so the single leg-day exercise carries a full
            // week's worth of volume instead of a fraction of it.
            const legsSetBonus = daysPerWeek === "5+" && LEGS_HIGH_GROUP_COUNT.has(muscleGroup) ? (LEGS_SET_BONUS[experience] ?? 0) : 0
            const rawSetsPerExercise = (exercisesPerGroup > 1 ? Math.max(baseSets - 1, 2) : baseSets) + legsSetBonus

            const slotsThisGroup = Math.min(exercisesPerGroup, pool.length)

            for (let slot = 0; slot < slotsThisGroup; slot++) {
                // Cycle through the pool across repeated days within the week (e.g. Mon/Wed/Fri
                // full body) and across multiple slots on the same day, starting from a
                // week-dependent offset so different weeks land on different exercises for
                // the same slot instead of always picking index 0.
                const usedIndex = usedIndexByGroup.get(muscleGroup) ?? rotationOffset
                const exercise = pool[usedIndex % pool.length]
                usedIndexByGroup.set(muscleGroup, usedIndex + 1)

                // The accumulation bonus only applies to the compound lift(s) in a group —
                // isolation work stays flat since it's already the lighter, higher-rep half
                // of the pairing and doesn't need its own ramp.
                const inAccumulationPhase = !isDeloadWeek && weekInBlock >= ACCUMULATION_START_WEEK && !isIsolationExercise(exercise.name)
                const setsPerExercise = isDeloadWeek
                    ? Math.max(Math.round(rawSetsPerExercise * DELOAD_SET_MULTIPLIER), 1)
                    : rawSetsPerExercise + (inAccumulationPhase ? ACCUMULATION_SET_BONUS : 0)

                const previous = previousTargets.get(exercise.id)
                const weightTier = STARTING_WEIGHT_KG[exercise.equipment!]?.[experience]
                const baseWeight = weightTier
                    ? (isIsolationExercise(exercise.name) ? weightTier.isolation : weightTier.compound * getCompoundWeightMultiplier(exercise.name))
                    : 0
                const defaultWeight = adjustForBodyStats(baseWeight, muscleGroup, exercise.equipment!, profile)
                const targetWeight = previous?.weightKg ?? defaultWeight
                const workingWeight = isDeloadWeek && targetWeight > 0
                    ? roundToIncrement(targetWeight * DELOAD_WEIGHT_MULTIPLIER, exercise.equipment!)
                    : targetWeight

                result.push({
                    exerciseId: exercise.id,
                    dayOfWeek: day.dayOfWeek,
                    sets: setsPerExercise,
                    reps: previous?.reps ?? reps,
                    weightKg: workingWeight,
                })
            }
        }
    }

    return result
}
