'use client'

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function LayoutWrapperMotion ({children}: {children:ReactNode }) {
    return(
        <motion.main
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}>
            {children}
        </motion.main>
    )
}