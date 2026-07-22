'use client'

import Image from "next/image"
import { babes } from "@/app/fonts"
import { Quotes } from "@phosphor-icons/react"
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
            className="px-5 sm:px-10 lg:px-20 py-16 text-white bg-surface-strong"
        >
            <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center gap-8 sm:gap-14">
                <Image
                    className="w-full sm:w-[42%] rounded-2xl shadow-lg"
                    src="/images/clientTransformation/daryushTransformation.png"
                    alt="Daryush before and after transformation"
                    width={600} height={600}
                />
                <div className="w-full sm:w-[58%] flex flex-col items-start gap-3 text-left">
                    <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                        Real client, real results
                    </span>
                    <h2 className={`${babes.className} text-4xl sm:text-5xl leading-[0.95] text-white`}>Client Transformation Spotlight</h2>
                    <p className="text-sm sm:text-base text-white/60">
                        Real words from someone who's lived the process — no scripts, no actors, just what actually happened.
                    </p>
                    <Quotes size={28} weight="fill" className="mt-2 text-white/20" />
                    <p className="text-base sm:text-lg whitespace-pre-line italic leading-relaxed text-white/90">
                        I used to think I just had "bad genetics".
                        I tried bulking on my own before, but all I gained was fat.
                        With Yevhenii's training and nutrition plan, I started seeing real changes.
                        Every week was well-structured, and I felt supported every step of the way.
                        Trust me — this guy knows exactly how to help you become the best version of yourself.
                    </p>
                    <p className="self-end italic text-sm sm:text-base text-white/50">-Daryush</p>
                </div>
            </div>
        </motion.section>
    )
}

export default ClientTransformationSection
