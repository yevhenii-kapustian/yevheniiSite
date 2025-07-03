import { animate, easeIn, MotionValue, useMotionValue, useMotionValueEvent } from "framer-motion";

export function useProductsMask(scrollXProgress: MotionValue<number>) {
    const left = `0%`
    const right = `100%`
    const leftInset = `20%`
    const rightInset = `80%`
    const transparent = `#0000`
    const opaque = `#000`

     const maskImage = useMotionValue(
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
    )

    useMotionValueEvent(scrollXProgress, "change", (value) => {
        if (value === 0) {
            animate(
                maskImage,
                `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
            )
        } else if (value === 1) {
            animate(
                maskImage,
                `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
            )
        } else if (
            scrollXProgress.getPrevious() === 0 ||
            scrollXProgress.getPrevious() === 1
        ) {
            animate(
                maskImage,
                `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
            )
        }
    })

    return maskImage
}

export const productVisibility = {
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            easeIn
        }
    }),
    hidden: {
        y: -200,
        opacity: 0, 
    },
    hover: {
        scale: 1.05
    },
    tap: {
        scale: 0.9
    }
}