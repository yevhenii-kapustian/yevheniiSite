'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "@phosphor-icons/react"

type AddModuleButtonProps = {
    productId: string
    email: string
    label: string
}

const AddModuleButton = ({ productId, email, label }: AddModuleButtonProps) => {
    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, email }),
            })
            const data = await res.json()
            if (data.url) window.location.href = data.url
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.button
            type="button"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            onClick={handleClick}
            disabled={loading}
            className="group inline-flex w-fit items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-60"
        >
            {loading ? "Loading…" : label}
            {!loading && <ArrowRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1"/>}
        </motion.button>
    )
}

export default AddModuleButton
