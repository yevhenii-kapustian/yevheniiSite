'use client'

import { benefitsSteps } from "@/data/benefitsSteps"
import { BenefitsStepsType } from "@/types/benefits"
import { babes } from "@/app/fonts"
import Image from "next/image"
import Button from "@/components/Button"
import { motion, useInView } from 'framer-motion'
import { useRef } from "react"
import { handleElementInView } from "@/utils/handleElementInView"

const BenefitsSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <motion.section
            ref={ref}
            initial={{y: 32, opacity: 0}}
            animate={isInView ? {y: 0, opacity: 1} : {}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="px-5 lg:px-20 py-10 flex flex-col items-center"
        >
            <h2 className={`${babes.className} text-3xl sm:text-4xl text-ink text-center`}>How it works</h2>
            <div className="py-10 flex flex-col items-center gap-10 sm:flex-row sm:justify-center">
                {benefitsSteps.map((item:BenefitsStepsType, index:number) => (
                    <div className="w-full sm:w-[70%] lg:w-[30%] lg:max-w-[22%] flex flex-col justify-between items-center text-center" key={index}>
                        <p className="w-10 h-10 flex justify-center items-center text-white font-bold bg-charcoal rounded-full">{item.step}</p>
                        <h3 className="pt-3 text-lg sm:text-xl font-bold">{item.title}</h3>
                        <p className="pt-2 text-sm sm:text-base">{item.description}</p>
                        <Image className="pt-4" src={item.image} alt={item.title} width={1500} height={1500} priority/>
                    </div>
                ))}
            </div>
            <Button
                scroll={false}
                onClick={e => handleElementInView(e, "#formCoaching")}
                href="#formCoaching"
                variant="solid"
            >
                Get My Personalized Plan
            </Button>
        </motion.section>
    )
}

export default BenefitsSection
