'use client'

import { benefitsSteps } from "@/data/benefitsSteps"
import { BenefitsStepsType } from "@/types/benefits"
import { babes } from "@/app/fonts"
import Image from "next/image"
import Button from "@/components/Button"
import { motion, useInView } from 'framer-motion'
import { useRef } from "react"
import { handleElementInView } from "@/utils/handleElementInView"

const colStart = ["sm:col-start-1", "sm:col-start-2", "sm:col-start-3"]

const BenefitsSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <motion.section
            ref={ref}
            initial={{y: 32, opacity: 0}}
            animate={isInView ? {y: 0, opacity: 1} : {}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="px-5 lg:px-20 pt-14 pb-10 sm:py-10 border-t border-black/[0.06] sm:border-t-0 flex flex-col items-center"
        >
            <h2 className={`${babes.className} text-4xl sm:text-5xl leading-[0.95] text-ink text-center`}>How it works</h2>

            {/* Mobile: swipeable carousel, rows shared across slides via subgrid so nothing drifts */}
            <div className="sm:hidden w-full py-10 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-5 px-5">
                <div className="grid gap-x-5" style={{ gridTemplateColumns: "repeat(3, 80%)" }}>
                    {benefitsSteps.map((item:BenefitsStepsType, index:number) => (
                        <div
                            key={index}
                            className="row-span-4 snap-center grid justify-items-center text-center"
                            style={{ gridTemplateRows: "subgrid" }}
                        >
                            <p className="row-start-1 w-10 h-10 flex justify-center items-center text-white font-bold bg-charcoal rounded-full">
                                {item.step}
                            </p>
                            <h3 className="row-start-2 pt-3 text-lg font-bold">
                                {item.title}
                            </h3>
                            <p className="row-start-3 pt-2 text-sm">
                                {item.description}
                            </p>
                            <Image
                                className="row-start-4 pt-4 w-full"
                                src={item.image}
                                alt={item.title}
                                width={1500}
                                height={1500}
                                priority
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Tablet/desktop: shared-row grid so every step lines up */}
            <div className="hidden sm:grid py-10 w-full max-w-5xl sm:grid-cols-3 sm:gap-x-10 justify-items-center text-center">
                {benefitsSteps.map((item:BenefitsStepsType, index:number) => (
                    <div key={index} className="contents">
                        <p className={`${colStart[index]} sm:row-start-1 w-10 h-10 flex justify-center items-center text-white font-bold bg-charcoal rounded-full`}>
                            {item.step}
                        </p>
                        <h3 className={`${colStart[index]} sm:row-start-2 pt-3 text-xl font-bold`}>
                            {item.title}
                        </h3>
                        <p className={`${colStart[index]} sm:row-start-3 pt-2 text-base`}>
                            {item.description}
                        </p>
                        <Image
                            className={`${colStart[index]} sm:row-start-4 w-full pt-4`}
                            src={item.image}
                            alt={item.title}
                            width={1500}
                            height={1500}
                            priority
                        />
                    </div>
                ))}
            </div>

            <Button
                scroll={false}
                onClick={e => handleElementInView(e, "#formCoaching")}
                href="#formCoaching"
                variant="solid"
                size="sm"
            >
                Get My Personalized Plan
            </Button>
        </motion.section>
    )
}

export default BenefitsSection
