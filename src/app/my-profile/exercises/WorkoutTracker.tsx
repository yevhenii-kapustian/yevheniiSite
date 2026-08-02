'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Confetti, Smiley, SmileyMeh, SmileySad } from "@phosphor-icons/react"

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const PUSH_MUSCLES = new Set(["Chest", "Shoulders", "Triceps"])
const PULL_MUSCLES = new Set(["Back", "Biceps"])
const LEG_MUSCLES = new Set(["Quads", "Hamstrings", "Calves", "Glutes"])

const getWorkoutLabel = (muscleGroups: string[]): string => {
    if (muscleGroups.length === 0) return "Rest day"

    const hasPush = muscleGroups.some(m => PUSH_MUSCLES.has(m))
    const hasPull = muscleGroups.some(m => PULL_MUSCLES.has(m))
    const hasLegs = muscleGroups.some(m => LEG_MUSCLES.has(m))
    const categories = [hasPush && "Push", hasPull && "Pull", hasLegs && "Legs"].filter(Boolean) as string[]

    if (categories.length === 1) return categories[0]
    if (categories.length === 0) return muscleGroups.join(" · ")
    if (hasLegs) return "Full Body"
    return "Upper"
}

export type TrainingPlanExercise = {
    planExerciseId: number
    name: string
    muscleGroup: string
    sets: number
    reps: number
    weightKg: number | null
}

type WorkoutLog = {
    plan_exercise_id: number
    set_number: number
    actual_reps: number
    actual_weight_kg: number
    effort: string
}

type Effort = "easy" | "moderate" | "hard"

const DIFFICULTY_OPTIONS: { value: Effort, label: string, icon: typeof Smiley }[] = [
    { value: "easy", label: "Too easy", icon: Smiley },
    { value: "moderate", label: "Just right", icon: SmileyMeh },
    { value: "hard", label: "Too hard", icon: SmileySad },
]

type WorkoutTrackerProps = {
    days: { dayOfWeek: number, exercises: TrainingPlanExercise[] }[]
    todayLogs: WorkoutLog[]
    todayDayOfWeek: number
}

type SetInput = { reps: number, weightKg: number, revealDifficulty: boolean }

const buildInitialInputs = (exercises: TrainingPlanExercise[]): SetInput[][] =>
    exercises.map(exercise => Array.from({ length: exercise.sets }, () => ({
        reps: exercise.reps,
        weightKg: exercise.weightKg ?? 0,
        revealDifficulty: false,
    })))

const WorkoutTracker = ({ days, todayLogs, todayDayOfWeek }: WorkoutTrackerProps) => {
    const router = useRouter()
    const [dayOfWeek, setDayOfWeek] = useState(todayDayOfWeek)
    const [saving, setSaving] = useState<string | null>(null)

    const day = days.find(d => d.dayOfWeek === dayOfWeek)
    const exercises = day?.exercises ?? []
    const isRestDay = exercises.length === 0
    const isToday = dayOfWeek === todayDayOfWeek

    const [inputsByExercise, setInputsByExercise] = useState<SetInput[][]>(() => buildInitialInputs(exercises))

    const selectDay = (nextDayOfWeek: number) => {
        setDayOfWeek(nextDayOfWeek)
        const nextExercises = days.find(d => d.dayOfWeek === nextDayOfWeek)?.exercises ?? []
        setInputsByExercise(buildInitialInputs(nextExercises))
    }

    const updateInput = (exerciseIndex: number, setIndex: number, patch: Partial<SetInput>) => {
        setInputsByExercise(prev => prev.map((sets, ei) => ei === exerciseIndex
            ? sets.map((set, si) => si === setIndex ? { ...set, ...patch } : set)
            : sets))
    }

    const logFor = (planExerciseId: number, setNumber: number) =>
        todayLogs.find(l => l.plan_exercise_id === planExerciseId && l.set_number === setNumber)

    const submitSet = async (exerciseIndex: number, setIndex: number, planExerciseId: number, effort: Effort) => {
        const input = inputsByExercise[exerciseIndex][setIndex]
        const key = `${planExerciseId}-${setIndex + 1}`
        setSaving(key)
        try {
            await fetch("/api/workout-sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planExerciseId,
                    setNumber: setIndex + 1,
                    actualReps: input.reps,
                    actualWeightKg: input.weightKg,
                    effort,
                }),
            })
            router.refresh()
        } finally {
            setSaving(null)
        }
    }

    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0)
    const doneSets = isToday
        ? exercises.reduce((sum, ex) => sum + todayLogs.filter(l => l.plan_exercise_id === ex.planExerciseId).length, 0)
        : 0
    const workoutComplete = isToday && !isRestDay && totalSets > 0 && doneSets === totalSets

    const dayMuscles = Array.from(new Set(exercises.map(e => e.muscleGroup)))
    const workoutLabel = getWorkoutLabel(dayMuscles)

    return (
        <div className="flex flex-col gap-8">
            <div>
                <p className="text-sm text-ink-strong/50">
                    {isToday ? "Today" : DAY_LABELS[dayOfWeek - 1]}
                    {` · ${workoutLabel}`}
                    {isToday && !isRestDay && ` · ${doneSets}/${totalSets} sets done`}
                </p>
            </div>

            <div className="flex gap-2">
                {DAY_LABELS.map((label, index) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => selectDay(index + 1)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
                            index + 1 === dayOfWeek
                                ? "border-black bg-black text-white"
                                : "border-black/10 text-ink-strong/60 hover:bg-black/5"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {isRestDay ? (
                    <motion.div
                        key="rest"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col items-center gap-1 rounded-2xl border border-black/10 py-16 text-center"
                    >
                        <p className="text-sm font-semibold text-ink-strong">Rest day</p>
                        <p className="text-sm text-ink-strong/50">No exercises scheduled — recover for the next session.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key={dayOfWeek}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4"
                    >
                        <AnimatePresence>
                            {workoutComplete && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center gap-3 rounded-2xl border border-black bg-black p-5 text-white"
                                >
                                    <Confetti size={24} weight="fill"/>
                                    <div>
                                        <p className="font-semibold">Workout complete!</p>
                                        <p className="text-sm text-white/60">Every set logged — nice work.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {exercises.map((exercise, exerciseIndex) => {
                                const doneCount = todayLogs.filter(l => l.plan_exercise_id === exercise.planExerciseId).length

                                return (
                                    <div key={exercise.planExerciseId} className="rounded-2xl border border-black/10 p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-ink-strong">{exercise.name}</p>
                                                <p className="text-sm text-ink-strong/40">
                                                    {exercise.muscleGroup} · {exercise.sets}×{exercise.reps} · {exercise.weightKg}kg
                                                </p>
                                            </div>
                                            {isToday && (
                                                <div className="flex shrink-0 gap-1">
                                                    {Array.from({ length: exercise.sets }, (_, i) => (
                                                        <span
                                                            key={i}
                                                            className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                                                                i < doneCount ? "bg-black" : "bg-black/10"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex flex-col gap-2">
                                            {Array.from({ length: exercise.sets }, (_, setIndex) => {
                                                const setNumber = setIndex + 1
                                                const log = logFor(exercise.planExerciseId, setNumber)
                                                const isDone = Boolean(log)
                                                const input = inputsByExercise[exerciseIndex]?.[setIndex]
                                                const key = `${exercise.planExerciseId}-${setNumber}`

                                                return (
                                                    <div key={setIndex} className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 ${
                                                                isDone ? "bg-black text-white" : "bg-black/[0.04] text-ink-strong/40"
                                                            }`}>
                                                                {setNumber}
                                                            </span>

                                                            {isDone ? (
                                                                <span className="text-ink-strong">{log!.actual_weight_kg}kg × {log!.actual_reps} reps</span>
                                                            ) : isToday ? (
                                                                <>
                                                                    <input
                                                                        type="number"
                                                                        value={input?.weightKg ?? 0}
                                                                        onChange={e => updateInput(exerciseIndex, setIndex, { weightKg: Number(e.target.value) })}
                                                                        className="w-16 rounded-lg border border-black/10 px-2 py-1.5 text-center text-ink-strong outline-none focus:border-black/30"
                                                                    />
                                                                    <span className="text-ink-strong/40">kg ×</span>
                                                                    <input
                                                                        type="number"
                                                                        value={input?.reps ?? 0}
                                                                        onChange={e => updateInput(exerciseIndex, setIndex, { reps: Number(e.target.value) })}
                                                                        className="w-16 rounded-lg border border-black/10 px-2 py-1.5 text-center text-ink-strong outline-none focus:border-black/30"
                                                                    />
                                                                    <span className="text-ink-strong/40">reps</span>
                                                                </>
                                                            ) : (
                                                                <span className="text-ink-strong/40">{exercise.weightKg}kg × {exercise.reps} reps</span>
                                                            )}

                                                            {isToday && !isDone && (
                                                                <motion.button
                                                                    type="button"
                                                                    whileTap={{ scale: 0.85 }}
                                                                    onClick={() => updateInput(exerciseIndex, setIndex, { revealDifficulty: !input?.revealDifficulty })}
                                                                    aria-label="Log this set"
                                                                    disabled={saving === key}
                                                                    className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                                                                        input?.revealDifficulty ? "border-black bg-black text-white" : "border-black/20 text-transparent hover:bg-black/5"
                                                                    }`}
                                                                >
                                                                    <Check size={14} weight="bold"/>
                                                                </motion.button>
                                                            )}
                                                        </div>

                                                        <AnimatePresence>
                                                            {isToday && !isDone && input?.revealDifficulty && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="ml-9 mt-2 flex flex-wrap gap-1.5">
                                                                        {DIFFICULTY_OPTIONS.map(option => {
                                                                            const Icon = option.icon
                                                                            return (
                                                                                <button
                                                                                    key={option.value}
                                                                                    type="button"
                                                                                    disabled={saving === key}
                                                                                    onClick={() => submitSet(exerciseIndex, setIndex, exercise.planExerciseId, option.value)}
                                                                                    className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-ink-strong/50 transition-colors duration-200 hover:border-black hover:bg-black hover:text-white disabled:opacity-40"
                                                                                >
                                                                                    <Icon size={13}/>
                                                                                    {option.label}
                                                                                </button>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default WorkoutTracker
