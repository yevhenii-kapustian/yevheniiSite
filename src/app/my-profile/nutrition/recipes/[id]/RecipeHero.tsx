'use client'

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import gsap from "gsap"
import { ArrowsOut, Fire, X } from "@phosphor-icons/react"

type RecipeHeroProps = {
    title: string
    imageUrl: string | null
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
    servings: number
}

const RecipeHero = ({ title, imageUrl, calories, proteinG, fatG, carbsG, servings }: RecipeHeroProps) => {
    const [fullscreen, setFullscreen] = useState(false)
    const fullscreenRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!fullscreen) return

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFullscreen(false)
        }
        document.addEventListener("keydown", handleKey)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", handleKey)
            document.body.style.overflow = ""
        }
    }, [fullscreen])

    useEffect(() => {
        if (!fullscreen || !fullscreenRef.current) return
        const ctx = gsap.context(() => {
            gsap.fromTo(fullscreenRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "power2.out" })
            gsap.fromTo("[data-fullscreen-image]", { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.32, ease: "power3.out" })
        }, fullscreenRef)

        return () => ctx.revert()
    }, [fullscreen])

    return (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] bg-black/[0.04] sm:aspect-[21/9]">
            {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={title} className="h-full w-full object-cover"/>
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"/>

            {imageUrl && (
                <button
                    type="button"
                    onClick={() => setFullscreen(true)}
                    aria-label="View full-size photo"
                    className="nav-blur absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
                >
                    <ArrowsOut size={16} weight="bold"/>
                </button>
            )}

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-8">
                <h1 className="max-w-2xl text-2xl font-semibold leading-tight text-white sm:text-3xl">{title}</h1>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="nav-blur flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                        <Fire size={12} weight="fill"/> {calories.toLocaleString("en-US")} kcal
                    </span>
                    <span className="nav-blur rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">Protein {proteinG}g</span>
                    <span className="nav-blur rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">Fat {fatG}g</span>
                    <span className="nav-blur rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">Carbs {carbsG}g</span>
                    <span className="nav-blur rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">{servings} servings</span>
                </div>
            </div>

            {imageUrl && typeof document !== "undefined" && createPortal(
                fullscreen ? (
                    <div
                        ref={fullscreenRef}
                        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 opacity-0 sm:p-8"
                        onClick={() => setFullscreen(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setFullscreen(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
                        >
                            <X size={18} weight="bold"/>
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            data-fullscreen-image
                            src={imageUrl}
                            alt={title}
                            className="max-h-full max-w-full rounded-lg object-contain opacity-0"
                            onClick={e => e.stopPropagation()}
                        />
                    </div>
                ) : null,
                document.body
            )}
        </div>
    )
}

export default RecipeHero
