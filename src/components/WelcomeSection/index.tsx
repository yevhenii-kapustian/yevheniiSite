'use client'

import Image from "next/image"
import { motion } from 'framer-motion'
import { babes } from "@/app/fonts"
import Button from "@/components/Button"
import { titleVariant, descriptionVariant, buttonsVariant } from "./animation"
import { handleElementInView } from "@/utils/handleElementInView"
import type { ReactNode } from "react"

type WelcomeSectionProps = {
    title: ReactNode,
    description: string
}

const WelcomeSection = ({title, description}:WelcomeSectionProps) => {
    return(
        <section id="hero" className="relative w-full min-h-screen h-[100dvh] sm:h-auto sm:min-h-0">
            <div className="relative h-full py-10 sm:py-40">
                <div className="absolute inset-x-0 -top-[90px] h-[calc(100%+90px)] sm:-top-[100px] sm:h-[calc(100%+100px)]">
                    <Image
                        className="w-full h-full object-cover object-[75%_25%] sm:object-[70%_25%] lg:object-[0_25%]"
                        src="/welcomeSection.jpg"
                        alt="welcome image"
                        fill
                        priority
                    />
                    <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,1)_10%,rgba(99,0,8,0)_70%)]"/>
                </div>

                <div className="relative w-full h-full max-w-full px-5 pt-10 flex flex-col justify-center items-start gap-[clamp(1rem,3vh,4rem)] sm:left-[10vw] sm:max-w-[60%] sm:px-0 sm:pt-0 sm:gap-5 lg:max-w-[45%]">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                        variants={titleVariant}
                        className={`${babes.className} text-4xl sm:text-5xl lg:text-6xl text-white text-shadow-[0px_0px_12px_#00000070]`}
                    >
                        {title}
                    </motion.h1>
                    <motion.h2
                        variants={descriptionVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-full lg:w-[70%] text-sm sm:text-base lg:text-lg text-white text-shadow-[0px_0px_12px_#00000070]"
                    >
                        {description}
                    </motion.h2>
                    <motion.div
                        variants={buttonsVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex gap-5"
                    >
                        <Button
                            href="/#formCoaching"
                            onClick={e => handleElementInView(e, "#formCoaching")}
                            variant="outline-light"
                        >
                            Personal Plan
                        </Button>
                        <Button href="/programs" variant="solid-light">
                            View All Plans
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default WelcomeSection
