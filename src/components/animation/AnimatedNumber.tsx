'use client'

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

type AnimatedNumberProps = {
    value: number
    locale?: string
}

const AnimatedNumber = ({ value, locale = "en-US" }: AnimatedNumberProps) => {
    const current = useRef({ value })
    const [display, setDisplay] = useState(() => Math.round(value).toLocaleString(locale))

    useEffect(() => {
        const tween = gsap.to(current.current, {
            value,
            duration: 0.55,
            ease: "power3.out",
            onUpdate: () => setDisplay(Math.round(current.current.value).toLocaleString(locale)),
        })

        return () => {
            tween.kill()
        }
    }, [locale, value])

    return <span>{display}</span>
}

export default AnimatedNumber
