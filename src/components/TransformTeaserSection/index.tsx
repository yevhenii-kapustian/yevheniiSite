'use client'

import { babes } from "@/app/fonts"
import Button from "@/components/Button"
import AnimatedNumber from "@/components/animation/AnimatedNumber"
import Reveal from "@/components/animation/Reveal"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"

const steps = [
    { label: "Lean", kcal: 2100, focus: "Fat loss" },
    { label: "Average", kcal: 2577, focus: "Recomposition" },
    { label: "Bulky", kcal: 2950, focus: "Hypertrophy" },
] as const

const CYCLE_MS = 2200

const TransformTeaserSection = () => {
    const ref = useRef<HTMLElement | null>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const focusRef = useRef<HTMLSpanElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
    const [hasEntered, setHasEntered] = useState(false)

    useEffect(() => {
        const node = ref.current
        if (!node) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) {
                setHasEntered(true)
                observer.disconnect()
            }
        }, { threshold: 0.25 })

        observer.observe(node)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!hasEntered) return
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % steps.length)
        }, CYCLE_MS)
        return () => clearInterval(interval)
    }, [hasEntered])

    useEffect(() => {
        gsap.to(progressRef.current, {
            width: `${(activeIndex / (steps.length - 1)) * 100}%`,
            duration: 0.5,
            ease: "power2.inOut",
        })
        gsap.fromTo(focusRef.current, { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" })
    }, [activeIndex])

    const active = steps[activeIndex]

    return (
        <Reveal
            as="section"
            ref={ref}
            className="overflow-hidden border-t border-black/[0.06]"
        >
            <div className="py-10 px-5 lg:px-20 flex flex-col items-center gap-5 sm:flex-row sm:justify-evenly bg-white">
                <div className="flex w-full flex-col items-start gap-3 text-left sm:w-[40%] lg:w-[50%]">
                    <h2 className={`${babes.className} text-4xl sm:text-5xl leading-[0.95] text-ink-strong`}>
                        See The Body You&apos;re Building
                    </h2>
                    <p className="text-sm sm:text-base text-ink-strong/70">
                        Enter your stats, drag one slider, and watch a 3D model show you exactly what lean, average, or bulky looks like on your frame — plus the calories it takes to get there.
                    </p>
                    <Button href="/get-started" variant="solid" size="sm" className="mt-2 h-12 w-full sm:w-auto">
                        Try It Now
                    </Button>
                </div>

                <div className="relative w-full sm:w-[60%] lg:w-[75%] max-w-[1000px]">
                    <div
                        aria-hidden
                        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-black/[0.04] via-transparent to-black/[0.04] blur-2xl"
                    />
                    <div className="flex flex-col gap-6 rounded-[2rem] border border-black/[0.06] bg-surface-muted p-8">
                        <div className="relative flex items-center justify-between">
                            <div className="absolute left-0 right-0 top-[7px] h-px bg-black/[0.08]" />
                            <div
                                ref={progressRef}
                                className="absolute top-[7px] h-px bg-ink-strong"
                            />
                            {steps.map((step, index) => (
                                <div key={step.label} className="relative flex flex-col items-center gap-2">
                                    <span
                                        className="rounded-full bg-ink-strong"
                                        style={{
                                            height: index === activeIndex ? 16 : 10,
                                            width: index === activeIndex ? 16 : 10,
                                            opacity: index === activeIndex ? 1 : 0.25,
                                            transition: "height 0.4s ease, width 0.4s ease, opacity 0.4s ease",
                                        }}
                                    />
                                    <span className={`text-xs transition-colors duration-300 ${index === activeIndex ? "font-semibold text-ink-strong" : "text-ink-strong/40"}`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="h-px w-full bg-black/[0.06]" />
                        <div className="flex items-end justify-between gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-ink-strong/35">Your target</span>
                                <p className={`${babes.className} text-4xl leading-[0.95] text-ink-strong`}>
                                    <AnimatedNumber value={active.kcal} /> <span className="text-sm font-normal tracking-normal text-ink-strong/40">kcal / day</span>
                                </p>
                            </div>
                            <span
                                ref={focusRef}
                                key={active.focus}
                                className="whitespace-nowrap rounded-full border border-black/10 px-3 py-1 text-xs font-medium text-ink-strong/60"
                            >
                                {active.focus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Reveal>
    )
}

export default TransformTeaserSection
