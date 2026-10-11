'use client'

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import { X } from "@phosphor-icons/react"

type ModalProps = {
    open: boolean
    title: string
    onClose: () => void
    children: React.ReactNode
    wide?: boolean
}

const Modal = ({ open, title, onClose, children, wide }: ModalProps) => {
    const [mounted, setMounted] = useState(open)
    const overlayRef = useRef<HTMLDivElement>(null)
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (open) setMounted(true)
    }, [open])

    useEffect(() => {
        if (!mounted) return

        const overlay = overlayRef.current
        const panel = panelRef.current
        if (!overlay || !panel) return

        if (open) {
            gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: "power2.out" })
            gsap.fromTo(panel, { autoAlpha: 0, y: 18, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.36, ease: "back.out(1.4)" })
            return
        }

        const timeline = gsap.timeline({ onComplete: () => setMounted(false) })
        timeline
            .to(panel, { autoAlpha: 0, y: 14, scale: 0.98, duration: 0.18, ease: "power2.in" })
            .to(overlay, { autoAlpha: 0, duration: 0.16, ease: "power2.in" }, 0)

        return () => {
            timeline.kill()
        }
    }, [mounted, open])

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
    if (!mounted) return null

    return createPortal(
        <div
            ref={overlayRef}
            className="nav-blur fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 opacity-0 sm:px-5"
            onClick={onClose}
        >
            <div
                ref={panelRef}
                className={`card-shadow max-h-[88vh] w-[92vw] sm:w-full overflow-y-auto rounded-[28px] border border-black/[0.05] bg-white p-5 opacity-0 sm:p-6 ${wide ? "max-w-5xl" : "max-w-lg"}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between sm:mb-6">
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
            </div>
        </div>,
        document.body
    )
}

export default Modal
