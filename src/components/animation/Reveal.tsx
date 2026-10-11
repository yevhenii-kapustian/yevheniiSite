'use client'

import { createElement, forwardRef, useLayoutEffect, useImperativeHandle, useRef, type ElementType, type ReactNode } from "react"
import gsap from "gsap"

type RevealProps = {
    as?: ElementType
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
    y?: number
    once?: boolean
}

const Reveal = forwardRef<HTMLElement, RevealProps>(function Reveal({
    as: Component = "div",
    children,
    className,
    delay = 0,
    duration = 0.65,
    y = 0,
    once = true,
}: RevealProps, forwardedRef) {
    const ref = useRef<HTMLElement | null>(null)

    useImperativeHandle(forwardedRef, () => ref.current as HTMLElement, [])

    useLayoutEffect(() => {
        const node = ref.current
        if (!node) return

        const ctx = gsap.context(() => {
            gsap.set(node, { autoAlpha: 0, y, willChange: y ? "transform, opacity" : "opacity" })
            const tween = gsap.to(node, {
                autoAlpha: 1,
                y: 0,
                delay,
                duration,
                ease: "power3.out",
                paused: true,
                clearProps: "transform,opacity,visibility,willChange",
            })

            const observer = new IntersectionObserver(([entry]) => {
                if (!entry?.isIntersecting) return
                tween.play()
                if (once) observer.disconnect()
            }, { threshold: 0.18 })

            observer.observe(node)
            return () => observer.disconnect()
        }, node)

        return () => ctx.revert()
    }, [delay, duration, once, y])

    return createElement(Component, { ref, className }, children)
})

export default Reveal
