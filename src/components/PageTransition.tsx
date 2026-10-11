'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"

const MIN_VISIBLE_MS = 260

const PageTransition = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname()
    const contentRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const veilRef = useRef<HTMLDivElement>(null)
    const startedAt = useRef<number>(0)
    const firstRender = useRef(true)
    const [loading, setLoading] = useState(false)

    useLayoutEffect(() => {
        const node = contentRef.current
        if (!node) return

        if (firstRender.current) {
            firstRender.current = false
            gsap.set(node, { clearProps: "transform,opacity,visibility" })
            return
        }

        gsap.fromTo(node, { autoAlpha: 0 }, {
            autoAlpha: 1,
            duration: 0.22,
            ease: "power3.out",
            clearProps: "opacity,visibility",
        })

        if (!loading) return

        const elapsed = performance.now() - startedAt.current
        const timeout = window.setTimeout(() => {
            setLoading(false)
        }, Math.max(0, MIN_VISIBLE_MS - elapsed))

        return () => window.clearTimeout(timeout)
        // Entrance should run only when the actual route changes.
        // `loading` changes separately when the overlay hides, and tying it here made pages animate twice.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    useEffect(() => {
        const overlays = [progressRef.current, veilRef.current].filter(Boolean)
        if (!overlays.length) return

        gsap.to(overlays, {
            autoAlpha: loading ? 1 : 0,
            duration: loading ? 0.16 : 0.28,
            ease: loading ? "power2.out" : "power3.out",
        })
    }, [loading])

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

            const target = event.target as HTMLElement | null
            const anchor = target?.closest("a")
            if (!anchor) return

            const href = anchor.getAttribute("href")
            const targetAttr = anchor.getAttribute("target")
            if (!href || targetAttr === "_blank" || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return

            const nextUrl = new URL(href, window.location.href)
            if (nextUrl.origin !== window.location.origin) return
            if (`${nextUrl.pathname}${nextUrl.search}` === `${window.location.pathname}${window.location.search}`) return

            startedAt.current = performance.now()
            setLoading(true)
        }

        document.addEventListener("click", handleClick, true)
        return () => document.removeEventListener("click", handleClick, true)
    }, [])

    return (
        <>
            <div
                ref={progressRef}
                className="pointer-events-none fixed inset-x-0 top-0 z-[120] flex h-1 items-start opacity-0"
                aria-hidden
            >
                <span className="h-full w-full origin-left animate-[routeLoading_0.9s_ease-in-out_infinite] bg-black"/>
            </div>
            <div
                ref={veilRef}
                className="pointer-events-none fixed inset-0 z-[119] flex items-center justify-center bg-white/45 opacity-0 backdrop-blur-[2px]"
                aria-hidden
            >
                <span className="h-9 w-9 rounded-full border-2 border-black/10 border-t-black animate-spin"/>
            </div>
            <div ref={contentRef}>
                {children}
            </div>
        </>
    )
}

export default PageTransition
