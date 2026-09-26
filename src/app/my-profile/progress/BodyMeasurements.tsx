'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Ruler, Trash } from "@phosphor-icons/react"
import Card, { CardIcon } from "../Card"

type Measurement = {
    id: number
    logged_at: string
    waist_cm: number | null
    chest_cm: number | null
    hips_cm: number | null
    thigh_cm: number | null
    arm_cm: number | null
}

const FIELDS = [
    { key: "waist", label: "Waist" },
    { key: "chest", label: "Chest" },
    { key: "hips", label: "Hips" },
    { key: "thigh", label: "Thigh" },
    { key: "arm", label: "Arm" },
] as const

const FIELD_VALUE_KEYS = {
    waist: "waist_cm",
    chest: "chest_cm",
    hips: "hips_cm",
    thigh: "thigh_cm",
    arm: "arm_cm",
} as const

const formatDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const BodyMeasurements = ({ measurements }: { measurements: Measurement[] }) => {
    const router = useRouter()
    const [values, setValues] = useState<Record<string, string>>({ waist: "", chest: "", hips: "", thigh: "", arm: "" })
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    const hasAnyValue = Object.values(values).some(v => v.trim() !== "")

    const handleSave = async () => {
        setSaving(true)
        setError(null)
        try {
            const res = await fetch("/api/body-measurements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            if (res.ok) {
                setValues({ waist: "", chest: "", hips: "", thigh: "", arm: "" })
                router.refresh()
            } else {
                setError("Couldn't save measurements — please try again.")
            }
        } catch {
            setError("Couldn't save measurements — please try again.")
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingId(id)
        setError(null)
        try {
            const res = await fetch("/api/body-measurements", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                router.refresh()
            } else {
                setError("Couldn't delete this entry — please try again.")
            }
        } catch {
            setError("Couldn't delete this entry — please try again.")
        } finally {
            setDeletingId(null)
        }
    }

    const latest = measurements[0]
    const latestValues = latest
        ? FIELDS.map(field => ({
            ...field,
            value: latest[FIELD_VALUE_KEYS[field.key]],
        })).filter(field => field.value != null)
        : []

    return (
        <Card className="flex flex-col gap-4 p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <CardIcon><Ruler size={14} weight="bold"/></CardIcon>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Measurements</span>
                </div>
                {latest && <span className="text-xs font-medium text-ink-strong/35">Latest {formatDate(latest.logged_at)}</span>}
            </div>

            {latestValues.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {latestValues.map(field => (
                        <div key={field.key} className="rounded-2xl bg-black/[0.03] px-3 py-3">
                            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-strong/35">{field.label}</p>
                            <p className="mt-1 text-lg font-semibold tracking-tight text-ink-strong">
                                {field.value}
                                <span className="ml-1 text-xs font-normal text-ink-strong/35">cm</span>
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-ink-strong/50">No measurements logged yet. Add only the numbers you want to track.</p>
            )}

            <div className="grid grid-cols-2 gap-2 border-t border-black/[0.05] pt-4 sm:grid-cols-5">
                {FIELDS.map(field => (
                    <div key={field.key} className="flex flex-col gap-1.5 rounded-2xl bg-black/[0.03] px-2 py-2 text-center">
                        <label className="text-[10px] font-medium uppercase tracking-[0.05em] text-ink-strong/35">{field.label}</label>
                        <input
                            type="number"
                            min="0"
                            value={values[field.key]}
                            onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                            placeholder="cm"
                            className="w-full bg-transparent text-center text-sm font-semibold text-ink-strong outline-none placeholder:font-normal placeholder:text-ink-strong/25"
                        />
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleSave}
                disabled={saving || !hasAnyValue}
                className="w-fit rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
            >
                {saving ? "Saving…" : "Log measurements"}
            </button>
            {error && <p className="text-xs text-red-500">{error}</p>}

            {measurements.length > 1 && (
                <div className="flex flex-col divide-y divide-black/[0.06] border-t border-black/[0.05] pt-2">
                    {measurements.slice(1, 5).map(m => (
                        <div key={m.id} className="group flex items-center justify-between gap-3 py-2 text-sm">
                            <span className="text-ink-strong/50">{formatDate(m.logged_at)}</span>
                            <span className="text-ink-strong/70">
                                {[
                                    m.waist_cm && `Waist ${m.waist_cm}`,
                                    m.chest_cm && `Chest ${m.chest_cm}`,
                                    m.hips_cm && `Hips ${m.hips_cm}`,
                                    m.thigh_cm && `Thigh ${m.thigh_cm}`,
                                    m.arm_cm && `Arm ${m.arm_cm}`,
                                ].filter(Boolean).join(" · ")}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleDelete(m.id)}
                                disabled={deletingId === m.id}
                                aria-label="Delete this measurement"
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-strong/30 opacity-0 transition-all duration-200 hover:bg-black/[0.045] hover:text-ink-strong group-hover:opacity-100 disabled:opacity-40"
                            >
                                <Trash size={12} weight="bold"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    )
}

export default BodyMeasurements
