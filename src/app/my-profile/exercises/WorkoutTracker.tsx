'use client'

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowsClockwise, CaretLeft, CaretRight, Check, Confetti, Info, Smiley, SmileyMeh, SmileySad, Trash } from "@phosphor-icons/react"
import Modal from "../Modal"
import Card from "../Card"
import { getWorkoutLabel } from "@/utils/workoutLabel"
import type { TrainingPlanExercise } from "@/supabase/queries"

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

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
    isPreviewWeek: boolean
    isDeloadWeek: boolean
}

// Mirrors isIsolationExercise in planGenerator.ts — kept as a small local check rather
// than a shared import since this is purely a display heuristic (should warm-up sets
// show), not something that needs to stay in perfect lockstep with the server-side one.
const ISOLATION_KEYWORDS = ["Curl", "Raise", "Extension", "Fly"]
const isIsolationName = (name: string) => ISOLATION_KEYWORDS.some(keyword => name.includes(keyword))

const getWarmupSets = (workingWeightKg: number, isIsolation: boolean) => {
    if (workingWeightKg <= 0 || isIsolation) return []
    const round = (value: number) => Math.round(value / 0.5) * 0.5
    return [
        { pct: "~50%", weightKg: round(workingWeightKg * 0.5) },
        { pct: "~75%", weightKg: round(workingWeightKg * 0.75) },
    ]
}

const REST_SECONDS_COMPOUND = 90
const REST_SECONDS_ISOLATION = 60

type SetInput = { reps: number, weightKg: number, revealDifficulty: boolean }

const buildInitialInputs = (exercises: TrainingPlanExercise[]): SetInput[][] =>
    exercises.map(exercise => Array.from({ length: exercise.sets }, () => ({
        reps: exercise.reps,
        weightKg: exercise.weightKg ?? 0,
        revealDifficulty: false,
    })))

const WorkoutTracker = ({ days, todayLogs, todayDayOfWeek, initialDayOfWeek, weekOffset, weekDates, hasPlanForWeek, isPreviewWeek, isDeloadWeek }: WorkoutTrackerProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const [dayOfWeek, setDayOfWeek] = useState(initialDayOfWeek ?? todayDayOfWeek)
    const [saving, setSaving] = useState<string | null>(null)
    const [deletingLogId, setDeletingLogId] = useState<number | null>(null)
    const [infoExercise, setInfoExercise] = useState<TrainingPlanExercise | null>(null)
    const [swappingId, setSwappingId] = useState<number | null>(null)
    const [swapHistory, setSwapHistory] = useState<Record<number, number[]>>({})
    const [swapErrorId, setSwapErrorId] = useState<number | null>(null)
    const [logError, setLogError] = useState<string | null>(null)
    const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null)

    const day = days.find(d => d.dayOfWeek === dayOfWeek)
    const exercises = day?.exercises ?? []
    const isRestDay = exercises.length === 0
    const isToday = weekOffset === 0 && dayOfWeek === todayDayOfWeek

    const [inputsByExercise, setInputsByExercise] = useState<SetInput[][]>(() => buildInitialInputs(exercises))

    // Re-syncs whenever the selected day OR the underlying week's data changes (e.g.
    // navigating weeks while staying on the same day-of-week column) — a plain click
    // handler alone would miss that second case since `days` changes without a click.
    // Also clears any rest-timer countdown left running from the previous day/week —
    // otherwise it kept ticking down against whatever exercise happens to render next.
    useEffect(() => {
        setInputsByExercise(buildInitialInputs(exercises))
        setRestSecondsLeft(null)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [days, dayOfWeek])

    const goToWeek = (nextOffset: number) => router.push(`${pathname}?day=${dayOfWeek}&week=${Math.min(nextOffset, 1)}`)

    useEffect(() => {
        if (restSecondsLeft === null) return
        if (restSecondsLeft <= 0) { setRestSecondsLeft(null); return }
        const timeout = setTimeout(() => setRestSecondsLeft(s => (s ?? 1) - 1), 1000)
        return () => clearTimeout(timeout)
    }, [restSecondsLeft])

    const swapExercise = async (planExerciseId: number, currentExerciseId: number) => {
        setSwappingId(planExerciseId)
        setSwapErrorId(null)
        try {
            const res = await fetch("/api/plan-exercises/swap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planExerciseId,
                    previouslySwappedIds: swapHistory[planExerciseId] ?? [],
                }),
            })
            if (res.ok) {
                setSwapHistory(prev => ({ ...prev, [planExerciseId]: [...(prev[planExerciseId] ?? []), currentExerciseId] }))
                router.refresh()
            } else {
                setSwapErrorId(planExerciseId)
            }
        } finally {
            setSwappingId(null)
        }
    }

    const updateInput = (exerciseIndex: number, setIndex: number, patch: Partial<SetInput>) => {
        setInputsByExercise(prev => prev.map((sets, ei) => ei === exerciseIndex
            ? sets.map((set, si) => si === setIndex ? { ...set, ...patch } : set)
            : sets))
    }

    const logFor = (planExerciseId: number, setNumber: number) =>
        todayLogs.find(l => l.plan_exercise_id === planExerciseId && l.set_number === setNumber)

    const submitSet = async (exerciseIndex: number, setIndex: number, planExerciseId: number, effort: Effort, isIsolation: boolean) => {
        const input = inputsByExercise[exerciseIndex][setIndex]
        const key = `${planExerciseId}-${setIndex + 1}`
        setSaving(key)
        setLogError(null)
        try {
            const res = await fetch("/api/workout-sets", {
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
            if (res.ok) {
                setRestSecondsLeft(isIsolation ? REST_SECONDS_ISOLATION : REST_SECONDS_COMPOUND)
                router.refresh()
            } else {
                setLogError("Couldn't save that set — please try again.")
            }
        } catch {
            setLogError("Couldn't save that set — please try again.")
        } finally {
            setSaving(null)
        }
    }

    const deleteSet = async (logId: number) => {
        setDeletingLogId(logId)
        setLogError(null)
        try {
            const res = await fetch("/api/workout-sets", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logId }),
            })
            if (res.ok) {
                router.refresh()
            } else {
                setLogError("Couldn't delete that set — please try again.")
            }
        } catch {
            setLogError("Couldn't delete that set — please try again.")
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
                {(isPreviewWeek || isDeloadWeek) && (
                    <div className="flex flex-wrap items-center gap-1.5">
                        {isPreviewWeek && (
                            <span className="rounded-full bg-black/[0.045] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-strong/50">
                                Preview
                            </span>
                        )}
                        {isDeloadWeek && (
                            <span className="rounded-full bg-black/[0.045] px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink-strong/50">
                                Deload
                            </span>
                        )}
                    </div>
                )}
                {isDeloadWeek && (
                    <p className="text-xs text-ink-strong/35">
                        Lighter week by design — fewer sets, less weight. Full intensity resumes next week.
                    </p>
                )}
                {isPreviewWeek && (
                    <p className="text-xs text-ink-strong/35">
                        A preview of next week — it may shift slightly once this week&apos;s sessions are done.
                    </p>
                )}

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
                                disabled={weekOffset >= 1}
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

            {/* key resets per-exercise input state on day change — no entrance animation
                tied to it, just React's normal remount-on-key-change behavior. */}
            <div key={dayOfWeek} className="flex flex-col gap-4">
                    <p className="text-sm text-ink-strong/50">
                        {isToday ? "Today" : DAY_LABELS[dayOfWeek - 1]}
                        {` · ${workoutLabel}`}
                        {isToday && !isRestDay && ` · ${doneSets}/${totalSets} sets done`}
                    </p>

                    {isRestDay ? (
                        <Card className="flex flex-col items-center gap-1 px-6 py-16 text-center">
                            <p className="text-sm font-semibold text-ink-strong">{hasPlanForWeek ? "Rest day" : "No plan recorded for this week"}</p>
                            <p className="text-sm text-ink-strong/50">
                                {hasPlanForWeek
                                    ? "No exercises scheduled — recover for the next session."
                                    : "This week predates your current training plan, so there's nothing logged here."}
                            </p>
                        </Card>
                    ) : (
                        <>
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

                        <AnimatePresence>
                            {restSecondsLeft !== null && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="card-shadow flex items-center justify-between gap-3 rounded-2xl bg-black/[0.045] px-4 py-2.5"
                                >
                                    <span className="text-sm font-medium text-ink-strong">Rest — {restSecondsLeft}s</span>
                                    <button
                                        type="button"
                                        onClick={() => setRestSecondsLeft(null)}
                                        className="text-xs font-medium text-ink-strong/40 hover:text-ink-strong"
                                    >
                                        Skip
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {logError && <p className="text-sm text-red-500">{logError}</p>}

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            {exercises.map((exercise, exerciseIndex) => {
                                const doneCount = todayLogs.filter(l => l.plan_exercise_id === exercise.planExerciseId).length
                                const allSetsDone = exercise.sets > 0 && doneCount >= exercise.sets
                                const warmupSets = isToday && !allSetsDone ? getWarmupSets(exercise.weightKg ?? 0, isIsolationName(exercise.name)) : []

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
                                                <div className="flex items-center gap-1.5">
                                                    {isToday && doneCount === 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => swapExercise(exercise.planExerciseId, exercise.exerciseId)}
                                                            disabled={swappingId === exercise.planExerciseId}
                                                            aria-label={`Swap ${exercise.name} for a different exercise`}
                                                            className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong/50 transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40"
                                                        >
                                                            <ArrowsClockwise size={14} weight="bold" className={swappingId === exercise.planExerciseId ? "animate-spin" : ""}/>
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setInfoExercise(exercise)}
                                                        aria-label={`View info for ${exercise.name}`}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong/50 transition-colors duration-200 hover:bg-black hover:text-white"
                                                    >
                                                        <Info size={14} weight="bold"/>
                                                    </button>
                                                </div>
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

                                        {swapErrorId === exercise.planExerciseId && (
                                            <p className="mt-2 text-xs text-red-500">No other {exercise.muscleGroup.toLowerCase()} exercise available to swap in with your current equipment.</p>
                                        )}

                                        {warmupSets.length > 0 && (
                                            <div className="mt-4 flex items-center gap-2 border-t border-black/[0.05] pt-4 text-xs text-ink-strong/40">
                                                <span className="font-medium uppercase tracking-[0.08em]">Warm-up</span>
                                                {warmupSets.map((w, i) => (
                                                    <span key={i} className="rounded-full bg-black/[0.03] px-2 py-1">{w.weightKg}kg <span className="text-ink-strong/25">{w.pct}</span></span>
                                                ))}
                                            </div>
                                        )}

                                        <div className={`flex flex-col gap-2 pt-4 ${warmupSets.length > 0 ? "mt-2" : "mt-4 border-t border-black/[0.05]"}`}>
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
                                                                                    onClick={() => submitSet(exerciseIndex, setIndex, exercise.planExerciseId, option.value, isIsolationName(exercise.name))}
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
                        </>
                    )}
            </div>

            <Modal open={infoExercise !== null} title={infoExercise?.name ?? ""} onClose={() => setInfoExercise(null)}>
                {infoExercise && (
                    <div className="flex flex-col gap-5">
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">{infoExercise.muscleGroup}</p>

                        <p className="text-sm leading-relaxed text-ink-strong/70">
                            {infoExercise.description ?? "No description available for this exercise yet."}
                        </p>

                        {infoExercise.howToPerform && (
                            <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-strong/35">How to perform</span>
                                <ol className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink-strong/70">
                                    {infoExercise.howToPerform.split("\n").filter(Boolean).map((step, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="shrink-0 font-medium text-ink-strong/40">{i + 1}.</span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        {infoExercise.musclesWorked && (
                            <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-strong/35">What muscles work</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {infoExercise.musclesWorked.split(",").map(m => m.trim()).filter(Boolean).map(muscle => (
                                        <span key={muscle} className="rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-medium text-ink-strong/70">{muscle}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {infoExercise.tips && (
                            <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-strong/35">Tips</span>
                                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink-strong/70">
                                    {infoExercise.tips.split("\n").filter(Boolean).map((tip, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="shrink-0 text-ink-strong/30">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {infoExercise.commonMistakes && (
                            <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-strong/35">Common mistakes</span>
                                <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink-strong/70">
                                    {infoExercise.commonMistakes.split("\n").filter(Boolean).map((mistake, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="shrink-0 text-ink-strong/30">•</span>
                                            {mistake}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default WorkoutTracker
