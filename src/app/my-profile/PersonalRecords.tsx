'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash, Trophy } from "@phosphor-icons/react"
import type { PersonalRecord } from "@/utils/trainingReport"
import Modal from "./Modal"
import Dropdown from "./Dropdown"
import Spinner from "@/components/Spinner"

type ExerciseOption = { planExerciseId: number, name: string }

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const PersonalRecords = ({ records, exerciseOptions }: { records: PersonalRecord[], exerciseOptions: ExerciseOption[] }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [planExerciseId, setPlanExerciseId] = useState(exerciseOptions[0]?.planExerciseId ?? "")
    const [weightKg, setWeightKg] = useState("")
    const [reps, setReps] = useState("")
    const [saving, setSaving] = useState(false)

    const [deletingLogId, setDeletingLogId] = useState<number | null>(null)

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

    const handleDelete = async (logId: number) => {
        setDeletingLogId(logId)
        try {
            const res = await fetch("/api/workout-sets", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ logId }),
            })
            if (res.ok) router.refresh()
        } finally {
            setDeletingLogId(null)
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
                        <div key={record.logId} className="group flex items-center justify-between gap-3 py-2.5 text-sm">
                            <span className="text-ink-strong">{record.exerciseName}</span>
                            <div className="flex shrink-0 items-center gap-2">
                                <div className="flex flex-col items-end">
                                    <span className="font-semibold text-ink-strong">{record.weightKg}kg × {record.reps}</span>
                                    <span className="text-[11px] text-ink-strong/40">{formatDate(record.performedAt)}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(record.logId)}
                                    disabled={deletingLogId === record.logId}
                                    aria-label={`Delete record for ${record.exerciseName}`}
                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-ink-strong/40 transition-colors duration-200 hover:bg-black/[0.045] hover:text-ink-strong disabled:opacity-40"
                                >
                                    <Trash size={14} weight="bold"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-ink-strong/50">No records yet — add your first one.</p>
            )}

            <Modal open={open} title="Log a record" onClose={() => setOpen(false)}>
                <div className="flex flex-col gap-3">
                    <Dropdown
                        value={planExerciseId}
                        onChange={value => setPlanExerciseId(Number(value))}
                        options={exerciseOptions.map(option => ({ value: option.planExerciseId, label: option.name }))}
                    />

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
                        className="flex items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
                    >
                        {saving ? <Spinner/> : "Save record"}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default PersonalRecords
