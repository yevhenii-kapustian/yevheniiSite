'use client'

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { CaretLeft, CaretRight, Check, Confetti, Info, Smiley, SmileyMeh, SmileySad, Trash } from "@phosphor-icons/react"
import Modal from "../Modal"
import Card from "../Card"
import { getWorkoutLabel } from "@/utils/workoutLabel"

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export type TrainingPlanExercise = {
    planExerciseId: number
    name: string
    muscleGroup: string
    description: string | null
    sets: number
    reps: number
    weightKg: number | null
}

type WorkoutLog = {
    id: number
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
    initialDayOfWeek?: number
    weekOffset: number
    weekDates: string[]
    hasPlanForWeek: boolean
}

type SetInput = { reps: number, weightKg: number, revealDifficulty: boolean }

const buildInitialInputs = (exercises: TrainingPlanExercise[]): SetInput[][] =>
    exercises.map(exercise => Array.from({ length: exercise.sets }, () => ({
        reps: exercise.reps,
        weightKg: exercise.weightKg ?? 0,
        revealDifficulty: false,
    })))

const WorkoutTracker = ({ days, todayLogs, todayDayOfWeek, initialDayOfWeek, weekOffset, weekDates, hasPlanForWeek }: WorkoutTrackerProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const [dayOfWeek, setDayOfWeek] = useState(initialDayOfWeek ?? todayDayOfWeek)
    const [saving, setSaving] = useState<string | null>(null)
    const [deletingLogId, setDeletingLogId] = useState<number | null>(null)
    const [infoExercise, setInfoExercise] = useState<TrainingPlanExercise | null>(null)

    const day = days.find(d => d.dayOfWeek === dayOfWeek)
    const exercises = day?.exercises ?? []
    const isRestDay = exercises.length === 0
    const isToday = weekOffset === 0 && dayOfWeek === todayDayOfWeek

    const [inputsByExercise, setInputsByExercise] = useState<SetInput[][]>(() => buildInitialInputs(exercises))

    // Re-syncs whenever the selected day OR the underlying week's data changes (e.g.
    // navigating weeks while staying on the same day-of-week column) — a plain click
    // handler alone would miss that second case since `days` changes without a click.
    useEffect(() => {
        setInputsByExercise(buildInitialInputs(exercises))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days, dayOfWeek])

    const goToWeek = (nextOffset: number) => router.push(`${pathname}?day=${dayOfWeek}&week=${Math.min(nextOffset, 0)}`)

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

    const deleteSet = async (logId: number) => {
        setDeletingLogId(logId)
        try {
            await fetch("/api/workout-sets", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logId }),
            })
            router.refresh()
        } finally {
            setDeletingLogId(null)
        }
    }

    const totalSets = exercises.reduce((sum, ex) => sum + ex.sets, 0)
    const doneSets = isToday
        ? exercises.reduce((sum, ex) => sum + todayLogs.filter(l => l.plan_exercise_id === ex.planExerciseId).length, 0)
        : 0
    const workoutComplete = isToday && !isRestDay && totalSets > 0 && doneSets === totalSets

    const dayMuscles = Array.from(new Set(exercises.map(e => e.muscleGroup)))
    const workoutLabel = getWorkoutLabel(dayMuscles)

    const monthLabel = new Date(`${weekDates[0]}T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-ink-strong/50">
                    {isToday ? "Today" : DAY_LABELS[dayOfWeek - 1]}
                    {` · ${workoutLabel}`}
                    {isToday && !isRestDay && ` · ${doneSets}/${totalSets} sets done`}
                </p>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">{monthLabel}</span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => goToWeek(weekOffset - 1)}
                                aria-label="Previous week"
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 hover:bg-black/[0.08]"
                            >
                                <CaretLeft size={12} weight="bold"/>
                            </button>
                            <button
                                type="button"
                                onClick={() => goToWeek(weekOffset + 1)}
                                disabled={weekOffset >= 0}
                                aria-label="Next week"
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 hover:bg-black/[0.08] disabled:opacity-30"
                            >
                                <CaretRight size={12} weight="bold"/>
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                        {weekDates.map((iso, index) => {
                            const dow = index + 1
                            const isSelected = dow === dayOfWeek
                            return (
                                <button
                                    key={iso}
                                    type="button"
                                    onClick={() => setDayOfWeek(dow)}
                                    className={`flex flex-col items-center gap-1.5 rounded-2xl py-2.5 transition-colors duration-200 ${
                                        isSelected ? "bg-black text-white" : "text-ink-strong/60 hover:bg-black/[0.045]"
                                    }`}
                                >
                                    <span className="text-[10px] font-medium tracking-wide opacity-60">{DAY_LABELS[index].toUpperCase()}</span>
                                    <span className="text-sm font-semibold">{Number(iso.slice(8, 10))}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isRestDay ? (
                    <motion.div
                        key="rest"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Card className="flex flex-col items-center gap-1 px-6 py-16 text-center">
                            <p className="text-sm font-semibold text-ink-strong">{hasPlanForWeek ? "Rest day" : "No plan recorded for this week"}</p>
                            <p className="text-sm text-ink-strong/50">
                                {hasPlanForWeek
                                    ? "No exercises scheduled — recover for the next session."
                                    : "This week predates your current training plan, so there's nothing logged here."}
                            </p>
                        </Card>
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
                                    className="card-shadow flex items-center gap-3 rounded-[28px] bg-black p-5 text-white"
                                >
                                    <Confetti size={24} weight="fill"/>
                                    <div>
                                        <p className="font-semibold">Workout complete!</p>
                                        <p className="text-sm text-white/70">Every set logged — nice work.</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {exercises.map((exercise, exerciseIndex) => {
                                const doneCount = todayLogs.filter(l => l.plan_exercise_id === exercise.planExerciseId).length

                                return (
                                    <Card key={exercise.planExerciseId} className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="font-semibold text-ink-strong">{exercise.name}</p>
                                                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-strong/40">
                                                    <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-xs font-medium text-ink-strong/60">{exercise.muscleGroup}</span>
                                                    {exercise.sets}×{exercise.reps} · {exercise.weightKg}kg
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 flex-col items-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setInfoExercise(exercise)}
                                                    aria-label={`View info for ${exercise.name}`}
                                                    className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong/50 transition-colors duration-200 hover:bg-black hover:text-white"
                                                >
                                                    <Info size={14} weight="bold"/>
                                                </button>
                                                {isToday && (
                                                    <div className="flex gap-1">
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
                                        </div>

                                        <div className="mt-4 flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                                            {Array.from({ length: exercise.sets }, (_, setIndex) => {
                                                const setNumber = setIndex + 1
                                                const log = logFor(exercise.planExerciseId, setNumber)
                                                const isDone = Boolean(log)
                                                const input = inputsByExercise[exerciseIndex]?.[setIndex]
                                                const key = `${exercise.planExerciseId}-${setNumber}`

                                                return (
                                                    <div key={setIndex} className="flex flex-col gap-2">
                                                        <div onClick={e => e.stopPropagation()} className="flex items-center gap-3 text-sm">
                                                            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors duration-200 ${
                                                                isDone ? "bg-black text-white" : "bg-black/[0.04] text-ink-strong/40"
                                                            }`}>
                                                                {setNumber}
                                                            </span>

                                                            {isDone ? (
                                                                <>
                                                                    <span className="text-ink-strong">{log!.actual_weight_kg}kg × {log!.actual_reps} reps</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => deleteSet(log!.id)}
                                                                        disabled={deletingLogId === log!.id}
                                                                        aria-label="Delete this set"
                                                                        className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-strong/30 transition-colors duration-200 hover:bg-black/[0.045] hover:text-ink-strong disabled:opacity-40"
                                                                    >
                                                                        <Trash size={13} weight="bold"/>
                                                                    </button>
                                                                </>
                                                            ) : isToday ? (
                                                                <>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={input?.weightKg ?? 0}
                                                                        onChange={e => updateInput(exerciseIndex, setIndex, { weightKg: Number(e.target.value) })}
                                                                        className="w-16 rounded-xl bg-black/[0.03] px-2 py-1.5 text-center text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.06]"
                                                                    />
                                                                    <span className="text-ink-strong/40">kg ×</span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={input?.reps ?? 0}
                                                                        onChange={e => updateInput(exerciseIndex, setIndex, { reps: Number(e.target.value) })}
                                                                        className="w-16 rounded-xl bg-black/[0.03] px-2 py-1.5 text-center text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.06]"
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
                                                                    className={`ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
                                                                        input?.revealDifficulty ? "bg-black text-white" : "bg-black/[0.045] text-transparent hover:bg-black/[0.08]"
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
                                                                    <div onClick={e => e.stopPropagation()} className="ml-9 mt-2 flex flex-wrap gap-1.5">
                                                                        {DIFFICULTY_OPTIONS.map(option => {
                                                                            const Icon = option.icon
                                                                            return (
                                                                                <button
                                                                                    key={option.value}
                                                                                    type="button"
                                                                                    disabled={saving === key}
                                                                                    onClick={() => submitSet(exerciseIndex, setIndex, exercise.planExerciseId, option.value)}
                                                                                    className="flex items-center gap-1.5 rounded-full bg-black/[0.045] px-3 py-1 text-xs font-medium text-ink-strong/50 transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40"
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
                                    </Card>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Modal open={infoExercise !== null} title={infoExercise?.name ?? ""} onClose={() => setInfoExercise(null)}>
                {infoExercise && (
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">{infoExercise.muscleGroup}</p>
                        <p className="text-sm leading-relaxed text-ink-strong/70">
                            {infoExercise.description ?? "No description available for this exercise yet."}
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default WorkoutTracker
