'use client'

import Image from "next/image"
import { motion } from 'framer-motion'
import { babes } from "@/app/fonts"
import Button from "@/components/Button"
import { ArrowRight } from "@phosphor-icons/react"
import { titleVariant, descriptionVariant, buttonsVariant } from "./animation"
import { handleElementInView } from "@/utils/handleElementInView"
import type { ReactNode } from "react"

type WelcomeSectionProps = {
    title: ReactNode,
    description: string
}

const WelcomeSection = ({title, description}:WelcomeSectionProps) => {
    return(
        <section id="hero" className="relative w-full flex flex-col min-h-[560px] sm:min-h-0">
            <div className="relative flex-1 py-10 sm:py-40">
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

                <div className="relative w-full h-full max-w-full px-5 pt-10 flex flex-col justify-center items-start gap-5 sm:left-[10vw] sm:max-w-[60%] sm:px-0 sm:pt-0 sm:gap-6 lg:max-w-[50%]">
                    <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                        Online Coaching
                    </span>
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.5 }}
                        variants={titleVariant}
                        className={`${babes.className} text-5xl sm:text-6xl lg:text-7xl leading-[0.95] text-white text-shadow-[0px_0px_12px_#00000070]`}
                    >
                        {title}
                    </motion.h1>
                    <motion.h2
                        variants={descriptionVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="w-full lg:w-[70%] text-xs sm:text-sm lg:text-base font-light leading-relaxed text-white/85 text-shadow-[0px_0px_12px_#00000070]"
                    >
                        {description}
                    </motion.h2>
                    <motion.div
                        variants={buttonsVariant}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto"
                    >
                        <Button
                            href="/#formCoaching"
                            onClick={e => handleElementInView(e, "#formCoaching")}
                            variant="outline-light"
                            size="sm"
                            className="h-12 w-full sm:w-auto gap-2"
                        >
                            Personal Plan
                            <ArrowRight size={16} weight="bold" />
                        </Button>
                        <Button href="/programs" variant="solid-light" size="sm" className="h-12 w-full sm:w-auto">
                            View All Plans
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default WelcomeSection
