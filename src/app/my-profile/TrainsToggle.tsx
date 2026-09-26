'use client'

import { useState } from "react"

type TrainsToggleProps = {
    initialValue: boolean
}

const TrainsToggle = ({ initialValue }: TrainsToggleProps) => {
    const [trainsWithProgram, setTrainsWithProgram] = useState(initialValue)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const noActivity = e.target.checked
        const value = !noActivity
        const previousValue = trainsWithProgram
        setTrainsWithProgram(value)
        setSaving(true)
        setError(null)
        try {
            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trainsWithProgram: value }),
            })
            if (!res.ok) {
                setTrainsWithProgram(previousValue)
                setError("Couldn't save — please try again.")
            }
        } catch {
            setTrainsWithProgram(previousValue)
            setError("Couldn't save — please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-sm text-ink-strong/70">
                <input
                    type="checkbox"
                    checked={!trainsWithProgram}
                    onChange={handleChange}
                    disabled={saving}
                    className="h-4 w-4 accent-black"
                />
                No physical activity
            </label>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

export default TrainsToggle
