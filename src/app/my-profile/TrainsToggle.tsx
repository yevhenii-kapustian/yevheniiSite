'use client'

import { useState } from "react"

type TrainsToggleProps = {
    initialValue: boolean
}

const TrainsToggle = ({ initialValue }: TrainsToggleProps) => {
    const [trainsWithProgram, setTrainsWithProgram] = useState(initialValue)
    const [saving, setSaving] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const noActivity = e.target.checked
        const value = !noActivity
        setTrainsWithProgram(value)
        setSaving(true)
        try {
            await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trainsWithProgram: value }),
            })
        } finally {
            setSaving(false)
        }
    }

    return (
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
    )
}

export default TrainsToggle
