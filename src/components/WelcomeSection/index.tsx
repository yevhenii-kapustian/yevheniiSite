'use client'

import Image from "next/image"
import { motion } from 'framer-motion'
import { babes } from "@/app/fonts"
import { imageStyles, 
         bgGradient, 
         welcomeContainerStyles, 
         textContainerStyles, 
         titleStyles, 
         descriptionStyles,
         buttonPersonalPlanStyles,
         buttonAllPlansStyles} from "./styles"
import { basicButtonStyles } from "@/styles/button"
import Link from "next/link"
import { titleVariant, descriptionVariant, buttonsVariant } from "./animation"
import { handleElementInView } from "@/utils/handleElementInView"

type WelcomeSectionProps = {
    title: any,
    description: string
}

const WelcomeSection = ({title, description}:WelcomeSectionProps) => {
    return(
        <section className={`${welcomeContainerStyles}`}>
            <div className="relative h-full py-40">
                <Image className={`${imageStyles}`} src="/welcomeSection.jpg" alt="welcome image" fill priority/>
                <span className={`${bgGradient}`}/>
                
                <div className={`${textContainerStyles}`}>
                    <motion.h1
                        initial='hidden'
                        animate='visible'
                        transition={{
                            duration: 0.5
                        }}
                        variants={titleVariant}
                        className={`${babes.className} ${titleStyles}`}>{title}</motion.h1>
                    <motion.h2
                        variants={descriptionVariant}
                        initial='hidden'
                        animate='visible'
                        transition={{
                            delay: 0.3,
                            duration: 0.5
                        }}
                        className={descriptionStyles}>{description}</motion.h2>
                    <motion.div
                        variants={buttonsVariant}
                        initial='hidden'
                        animate='visible'
                        transition={{
                            delay: 0.6,
                            duration: 0.5
                        }}
                        className="flex gap-5">
                        <Link href="/#formCoaching" 
                                onClick={e => handleElementInView(e, "#formCoaching")} 
                                className={`${basicButtonStyles} ${buttonPersonalPlanStyles}`}
                        >
                                Personal Plan
                        </Link>
                        <Link href="/programs" 
                                className={`${basicButtonStyles} ${buttonAllPlansStyles}`}
                        >
                                View All Plans
                        </Link>
                    </motion.div>
                </div>
            </div>

        </section>
    )
}

export default WelcomeSection