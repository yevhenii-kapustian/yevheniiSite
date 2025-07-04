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
         buttonStartStyles, 
         buttonAccountStyles} from "./styles"
import { basicButtonStyles } from "@/styles/button"
import { titleVariant, descriptionVariant } from "./animation"

type WelcomeSectionProps = {
    title: any,
    description: string
}

const WelcomeSection = ({title, description}:WelcomeSectionProps) => {
    return(
        <section className={`${welcomeContainerStyles}`}>
            <div className="relative h-full">
                <Image className={`${imageStyles}`} src="/welcomeSection.jpg" alt="welcome image" fill priority/>
                <span className={`${bgGradient}`}/>
                
                <div className={`${textContainerStyles}`}>
                    <motion.h1
                        initial={'hidden'}
                        animate={'visible'}
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
                            duration: 0.5
                        }}
                        className={descriptionStyles}>{description}</motion.h2>
                    <div className="flex gap-5">
                        <button className={`${basicButtonStyles} ${buttonStartStyles}`}>
                                Get Started
                        </button>
                        <button className={`${basicButtonStyles} ${buttonAccountStyles}`}>
                                My Account
                        </button>
                    </div>
                </div>
            </div>

        </section>
    )
}

export default WelcomeSection