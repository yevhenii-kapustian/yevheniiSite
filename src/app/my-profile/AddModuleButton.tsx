'use client'

import { useState } from "react"
import { ArrowRight } from "@phosphor-icons/react"
import Spinner from "@/components/Spinner"

type AddModuleButtonProps = {
    productId: string
    email: string
    label: string
}

const AddModuleButton = ({ productId, email, label }: AddModuleButtonProps) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleClick = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, email, successPath: "/setup", cancelPath: "/my-profile" }),
            })
            const data = await res.json()
            if (res.ok && data.url) {
                window.location.href = data.url
            } else {
                setError(data.message || "Couldn't start checkout — please try again.")
            }
        } catch {
            setError("Couldn't start checkout — please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-start gap-2">
            <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                className="group relative inline-flex w-fit items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-ink-strong active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
            >
                <span className={`inline-flex items-center gap-1.5 ${loading ? "invisible" : ""}`}>
                    {label}
                    <ArrowRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1"/>
                </span>
                {loading && <span className="absolute inset-0 flex items-center justify-center"><Spinner/></span>}
            </button>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

export default AddModuleButton
