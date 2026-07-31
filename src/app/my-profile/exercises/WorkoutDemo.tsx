'use client'

import { useState } from "react"

type SetTemplate = {
    reps: number
    weightKg: number
}

type ExerciseTemplate = {
    name: string
    muscle: string
    sets: SetTemplate[]
}

type DayTemplate = {
    label: string
    focus: string
    muscles: string[]
    exercises: ExerciseTemplate[]
}

export const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export const WEEKLY_SPLIT: DayTemplate[] = [
    {
        label: "Day 1 · Push",
        focus: "Push",
        muscles: ["Chest", "Shoulders", "Triceps"],
        exercises: [
            { name: "Barbell Bench Press", muscle: "Chest", sets: [{ reps: 8, weightKg: 60 }, { reps: 8, weightKg: 60 }, { reps: 8, weightKg: 60 }, { reps: 8, weightKg: 60 }] },
            { name: "Seated Dumbbell Press", muscle: "Shoulders", sets: [{ reps: 12, weightKg: 18 }, { reps: 12, weightKg: 18 }, { reps: 12, weightKg: 18 }] },
            { name: "Triceps Pushdown", muscle: "Triceps", sets: [{ reps: 12, weightKg: 20 }, { reps: 12, weightKg: 20 }, { reps: 12, weightKg: 20 }] },
        ],
    },
    {
        label: "Day 2 · Pull",
        focus: "Pull",
        muscles: ["Back", "Biceps"],
        exercises: [
            { name: "Deadlift", muscle: "Back", sets: [{ reps: 6, weightKg: 100 }, { reps: 6, weightKg: 100 }, { reps: 6, weightKg: 100 }, { reps: 6, weightKg: 100 }] },
            { name: "Barbell Row", muscle: "Back", sets: [{ reps: 10, weightKg: 50 }, { reps: 10, weightKg: 50 }, { reps: 10, weightKg: 50 }, { reps: 10, weightKg: 50 }] },
            { name: "Barbell Curl", muscle: "Biceps", sets: [{ reps: 12, weightKg: 15 }, { reps: 12, weightKg: 15 }, { reps: 12, weightKg: 15 }] },
        ],
    },
    {
        label: "Day 3 · Legs",
        focus: "Legs",
        muscles: ["Quads", "Hamstrings", "Calves"],
        exercises: [
            { name: "Back Squat", muscle: "Quads", sets: [{ reps: 8, weightKg: 70 }, { reps: 8, weightKg: 70 }, { reps: 8, weightKg: 70 }, { reps: 8, weightKg: 70 }] },
            { name: "Leg Press", muscle: "Quads", sets: [{ reps: 12, weightKg: 100 }, { reps: 12, weightKg: 100 }, { reps: 12, weightKg: 100 }] },
            { name: "Standing Calf Raise", muscle: "Calves", sets: [{ reps: 15, weightKg: 40 }, { reps: 15, weightKg: 40 }, { reps: 15, weightKg: 40 }, { reps: 15, weightKg: 40 }] },
        ],
    },
    {
        label: "Day 4 · Rest",
        focus: "Rest",
        muscles: [],
        exercises: [],
    },
    {
        label: "Day 5 · Upper Body",
        focus: "Upper body",
        muscles: ["Chest", "Back", "Shoulders"],
        exercises: [
            { name: "Incline Bench Press", muscle: "Chest", sets: [{ reps: 8, weightKg: 50 }, { reps: 8, weightKg: 50 }, { reps: 8, weightKg: 50 }, { reps: 8, weightKg: 50 }] },
            { name: "Lat Pulldown", muscle: "Back", sets: [{ reps: 10, weightKg: 45 }, { reps: 10, weightKg: 45 }, { reps: 10, weightKg: 45 }, { reps: 10, weightKg: 45 }] },
            { name: "Lateral Raise", muscle: "Shoulders", sets: [{ reps: 15, weightKg: 8 }, { reps: 15, weightKg: 8 }, { reps: 15, weightKg: 8 }] },
        ],
    },
    {
        label: "Day 6 · Lower Body",
        focus: "Lower body",
        muscles: ["Quads", "Hamstrings"],
        exercises: [
            { name: "Front Squat", muscle: "Quads", sets: [{ reps: 6, weightKg: 50 }, { reps: 6, weightKg: 50 }, { reps: 6, weightKg: 50 }, { reps: 6, weightKg: 50 }] },
            { name: "Romanian Deadlift", muscle: "Hamstrings", sets: [{ reps: 10, weightKg: 60 }, { reps: 10, weightKg: 60 }, { reps: 10, weightKg: 60 }] },
            { name: "Leg Curl", muscle: "Hamstrings", sets: [{ reps: 12, weightKg: 30 }, { reps: 12, weightKg: 30 }, { reps: 12, weightKg: 30 }] },
        ],
    },
    {
        label: "Day 7 · Rest",
        focus: "Rest",
        muscles: [],
        exercises: [],
    },
]

type SetState = SetTemplate & { done: boolean }

const buildInitialState = (day: DayTemplate): SetState[][] =>
    day.exercises.map(exercise => exercise.sets.map(set => ({ ...set, done: false })))

const WorkoutDemo = () => {
    const todayIndex = (new Date().getDay() + 6) % 7 // Monday = 0
    const [dayIndex, setDayIndex] = useState(todayIndex)
    const [setsByExercise, setSetsByExercise] = useState<SetState[][]>(() => buildInitialState(WEEKLY_SPLIT[todayIndex]))

    const day = WEEKLY_SPLIT[dayIndex]
    const isRestDay = day.exercises.length === 0

    const selectDay = (index: number) => {
        setDayIndex(index)
        setSetsByExercise(buildInitialState(WEEKLY_SPLIT[index]))
    }

    const updateSet = (exerciseIndex: number, setIndex: number, patch: Partial<SetState>) => {
        setSetsByExercise(prev => prev.map((sets, ei) => ei === exerciseIndex
            ? sets.map((set, si) => si === setIndex ? { ...set, ...patch } : set)
            : sets))
    }

    const totalSets = setsByExercise.reduce((sum, sets) => sum + sets.length, 0)
    const doneSets = setsByExercise.reduce((sum, sets) => sum + sets.filter(s => s.done).length, 0)

    return (
        <div className="flex flex-col gap-8">
            <div>
                <p className="text-sm text-ink-strong/50">
                    {day.label}
                    {day.muscles.length > 0 && ` · ${day.muscles.join(" · ")}`}
                    {!isRestDay && ` · ${doneSets}/${totalSets} sets done`}
                </p>
            </div>

            <div className="flex gap-2">
                {DAY_LABELS.map((label, index) => (
                    <button
                        key={label}
                        type="button"
                        onClick={() => selectDay(index)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors duration-200 ${
                            index === dayIndex
                                ? "border-black bg-black text-white"
                                : "border-black/10 text-ink-strong/60 hover:bg-black/5"
                        }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {isRestDay ? (
                <div className="flex flex-col items-center gap-1 rounded-xl border border-black/10 py-16 text-center">
                    <p className="text-sm font-semibold text-ink-strong">Rest day</p>
                    <p className="text-sm text-ink-strong/50">No exercises scheduled — recover for the next session.</p>
                </div>
            ) : (
                <div className="flex max-w-2xl flex-col gap-4">
                    {day.exercises.map((exercise, exerciseIndex) => (
                        <div key={exercise.name} className="rounded-xl border border-black/10 p-5">
                            <p className="font-semibold text-ink-strong">{exercise.name}</p>
                            <p className="text-sm text-ink-strong/40">
                                {exercise.muscle} · {exercise.sets.length}×{exercise.sets[0].reps} · {exercise.sets[0].weightKg}kg
                            </p>

                            <div className="mt-4 flex flex-col gap-2">
                                {setsByExercise[exerciseIndex].map((set, setIndex) => (
                                    <div key={setIndex} className="flex items-center gap-3 text-sm">
                                        <span className="w-6 text-ink-strong/40">#{setIndex + 1}</span>
                                        <input
                                            type="number"
                                            value={set.weightKg}
                                            onChange={e => updateSet(exerciseIndex, setIndex, { weightKg: Number(e.target.value) })}
                                            className="w-16 rounded-lg border border-black/10 px-2 py-1.5 text-center text-ink-strong outline-none focus:border-black/30"
                                        />
                                        <span className="text-ink-strong/40">kg ×</span>
                                        <input
                                            type="number"
                                            value={set.reps}
                                            onChange={e => updateSet(exerciseIndex, setIndex, { reps: Number(e.target.value) })}
                                            className="w-16 rounded-lg border border-black/10 px-2 py-1.5 text-center text-ink-strong outline-none focus:border-black/30"
                                        />
                                        <span className="text-ink-strong/40">reps</span>
                                        <button
                                            type="button"
                                            onClick={() => updateSet(exerciseIndex, setIndex, { done: !set.done })}
                                            aria-label={set.done ? "Mark set incomplete" : "Mark set complete"}
                                            className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors duration-200 ${
                                                set.done ? "border-black bg-black text-white" : "border-black/20 text-transparent"
                                            }`}
                                        >
                                            ✓
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default WorkoutDemo
