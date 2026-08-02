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
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-5"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="h-[80vh] w-[80vw] max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-ink-strong">{title}</h2>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-strong/50 transition-colors duration-200 hover:bg-black/5"
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
