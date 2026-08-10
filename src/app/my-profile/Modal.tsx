'use client'

import { useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "@phosphor-icons/react"

type ModalProps = {
    open: boolean
    title: string
    onClose: () => void
    children: React.ReactNode
}

const Modal = ({ open, title, onClose, children }: ModalProps) => {
    useEffect(() => {
        if (!open) return

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleKey)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", handleKey)
            document.body.style.overflow = ""
        }
    }, [open, onClose])

    if (typeof document === "undefined") return null

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="nav-blur fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-5"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                        className="card-shadow max-h-[80vh] w-[80vw] max-w-6xl overflow-y-auto rounded-[32px] border border-black/[0.05] bg-white p-6 sm:p-8"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-tight text-ink-strong">{title}</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/50 transition-colors duration-200 hover:bg-black/[0.08]"
                            >
                                <X size={16} weight="bold"/>
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default Modal
