export const productVisibility = {
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut" as const
        }
    }),
    hidden: {
        y: 24,
        opacity: 0,
    },
}