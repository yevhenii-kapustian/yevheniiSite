'use client'

import Image from "next/image"
import { babes } from "@/app/fonts"
import { motion, useInView } from 'framer-motion'
import { useRef } from "react"

const ClientTransformationSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <motion.section
            ref={ref}
            initial={{y: 32, opacity: 0}}
            animate={isInView ? {y: 0, opacity: 1} : {}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="p-5 sm:p-10 text-ink-strong"
        >
            <h2 className={`${babes.className} text-3xl sm:text-4xl text-center`}>Client Transformation Spotlight</h2>
            <h3 className="text-center text-sm sm:text-base">Real words from someone who's lived the process</h3>
            <div className="pt-5 relative flex flex-col sm:flex-row justify-center items-center gap-10">
                <Image
                    className="w-full sm:w-[50%] max-w-120 rounded-xl"
                    src="/images/clientTransformation/daryushTransformation.png"
                    alt="name"
                    width={600} height={600}
                />
                <div className="w-full sm:w-[40%]">
                    <h5 className="text-base sm:text-lg whitespace-pre-line italic">
                        I used to think I just had "bad genetics".
                        I tried bulking on my own before, but all I gained was fat.
                        With Yevhenii's training and nutrition plan, I started seeing real changes.
                        Every week was well-structured, and I felt supported every step of the way.
                        Trust me — this guy knows exactly how to help you become the best version of yourself.
                    </h5>
                    <p className="pt-5 text-end italic text-sm sm:text-base">-Daryush</p>
                </div>
            </div>
        </motion.section>
    )
}

export default ClientTransformationSection
