'use client'

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { CaretDown, Check } from "@phosphor-icons/react"

type DropdownOption = { value: number | string, label: string }

type DropdownProps = {
    value: number | string
    onChange: (value: number | string) => void
    options: DropdownOption[]
}

const Dropdown = ({ value, onChange, options }: DropdownProps) => {
    const [open, setOpen] = useState(false)
    const [rect, setRect] = useState<{ top: number, left: number, width: number } | null>(null)
    const rootRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLButtonElement>(null)
    const selected = options.find(option => option.value === value)

    useEffect(() => {
        if (!open) return

        const updateRect = () => {
            if (!triggerRef.current) return
            const bounds = triggerRef.current.getBoundingClientRect()
            setRect({ top: bounds.bottom + 6, left: bounds.left, width: bounds.width })
        }
        updateRect()

        const handleClick = (e: MouseEvent) => {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
        }
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }
        window.addEventListener("resize", updateRect)
        window.addEventListener("scroll", updateRect, true)
        document.addEventListener("mousedown", handleClick)
        document.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("resize", updateRect)
            window.removeEventListener("scroll", updateRect, true)
            document.removeEventListener("mousedown", handleClick)
            document.removeEventListener("keydown", handleKey)
        }
    }, [open])

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className="flex w-full items-center justify-between gap-2 rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-left text-sm text-ink-strong outline-none transition-colors duration-200 hover:bg-black/[0.05]"
            >
                <span className="truncate">{selected?.label ?? "Select…"}</span>
                <CaretDown size={12} weight="bold" className={`shrink-0 text-ink-strong/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}/>
            </button>

            {typeof document !== "undefined" && createPortal(
                <AnimatePresence>
                    {open && rect && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            style={{ top: rect.top, left: rect.left, width: rect.width }}
                            className="card-shadow fixed z-[110] max-h-60 overflow-y-auto rounded-2xl border border-black/[0.05] bg-white p-1.5"
                        >
                            {options.map(option => {
                                const isSelected = option.value === value
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value)
                                            setOpen(false)
                                        }}
                                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors duration-200 ${
                                            isSelected ? "bg-black text-white" : "text-ink-strong hover:bg-black/[0.045]"
                                        }`}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {isSelected && <Check size={13} weight="bold" className="shrink-0"/>}
                                    </button>
                                )
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    )
}

export default Dropdown
