'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trophy } from "@phosphor-icons/react"
import type { PersonalRecord } from "@/utils/trainingReport"
import Modal from "./Modal"

type ExerciseOption = { planExerciseId: number, name: string }

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const PersonalRecords = ({ records, exerciseOptions }: { records: PersonalRecord[], exerciseOptions: ExerciseOption[] }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [planExerciseId, setPlanExerciseId] = useState(exerciseOptions[0]?.planExerciseId ?? "")
    const [weightKg, setWeightKg] = useState("")
    const [reps, setReps] = useState("")
    const [saving, setSaving] = useState(false)

    const handleSubmit = async () => {
        if (!planExerciseId || !weightKg || !reps) return
        setSaving(true)
        try {
            const res = await fetch("/api/workout-sets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planExerciseId,
                    setNumber: 1,
                    actualReps: reps,
                    actualWeightKg: weightKg,
                    effort: "hard",
                }),
            })
            if (res.ok) {
                setWeightKg("")
                setReps("")
                setOpen(false)
                router.refresh()
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
                        <Trophy size={14} weight="bold"/>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Personal records</span>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex items-center gap-1 rounded-full bg-black/[0.045] py-1 pl-2 pr-3 text-xs font-medium text-ink-strong/60 transition-colors duration-200 hover:bg-black hover:text-white"
                >
                    <Plus size={12} weight="bold"/> Add record
                </button>
            </div>

            {records.length > 0 ? (
                <div className="flex flex-col divide-y divide-black/[0.06]">
                    {records.map(record => (
                        <div key={record.exerciseName} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                            <span className="text-ink-strong">{record.exerciseName}</span>
                            <div className="flex shrink-0 flex-col items-end">
                                <span className="font-semibold text-ink-strong">{record.weightKg}kg × {record.reps}</span>
                                <span className="text-[11px] text-ink-strong/40">{formatDate(record.performedAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-ink-strong/50">No records yet — add your first one.</p>
            )}

            <Modal open={open} title="Log a record" onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-3">
                    <select
                        value={planExerciseId}
                        onChange={e => setPlanExerciseId(Number(e.target.value))}
                        className="w-full rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                    >
                        {exerciseOptions.map(option => (
                            <option key={option.planExerciseId} value={option.planExerciseId}>{option.name}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            min="0"
                            value={weightKg}
                            onChange={e => setWeightKg(e.target.value)}
                            placeholder="Weight, kg"
                            className="w-full rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-center text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                        />
                        <input
                            type="number"
                            min="0"
                            value={reps}
                            onChange={e => setReps(e.target.value)}
                            placeholder="Reps"
                            className="w-full rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-center text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving || !weightKg || !reps}
                        className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
                    >
                        {saving ? "Saving…" : "Save record"}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default PersonalRecords
