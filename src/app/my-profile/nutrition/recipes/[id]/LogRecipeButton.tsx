'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Plus } from "@phosphor-icons/react"

type LogRecipeButtonProps = {
    name: string
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

const LogRecipeButton = ({ name, calories, proteinG, fatG, carbsG }: LogRecipeButtonProps) => {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [done, setDone] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleLog = async () => {
        setSaving(true)
        setError(null)
        try {
            const res = await fetch("/api/intake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mealType: "snack", name, calories, proteinG, fatG, carbsG }),
            })
            if (res.ok) {
                setDone(true)
                router.refresh()
            } else {
                const data = await res.json().catch(() => null)
                setError(data?.message || "Couldn't log this meal — please try again.")
            }
        } catch {
            setError("Couldn't log this meal — please try again.")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={handleLog}
                disabled={saving}
                className="flex w-fit items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
            >
                {done ? <Check size={16} weight="bold"/> : <Plus size={16} weight="bold"/>}
                {done ? "Logged for today" : "Log as a meal today"}
            </button>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

export default LogRecipeButton
