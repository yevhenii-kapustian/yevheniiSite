'use client'

import { motion } from "motion/react";
import { ReactNode } from "react";

export default function LayoutWrapperMotion ({children}: {children:ReactNode }) {
    return(
        <motion.main
                    initial={{opacity: 0, y: 40}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                    className="flex-grow">
            {children}
        </motion.main>
    )
}