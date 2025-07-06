import { easeIn } from "framer-motion";

export const productVisibility = {
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.8,
            easeIn
        }
    }),
    hidden: {
        y: -200,
        opacity: 0, 
    },
    // hover: {
    //     scale: 1.05
    // },
    // tap: {
    //     scale: 0.9
    // }
}