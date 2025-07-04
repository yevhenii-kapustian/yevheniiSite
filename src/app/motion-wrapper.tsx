'use client'

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function LayoutWrapperMotion ({children}: {children:ReactNode }) {
    return(
        <motion.main
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5}}
                    className="flex-grow">
            {children}
        </motion.main>
    )
}