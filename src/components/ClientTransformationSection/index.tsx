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
            className="p-5 sm:p-10 text-ink-strong"
        >
            <h2 className={`${babes.className} text-3xl sm:text-4xl text-center`}>Client Transformation Spotlight</h2>
            <h3 className="text-center text-sm sm:text-base text-ink-strong/60">Real words from someone who's lived the process</h3>
            <div className="mx-auto mt-8 max-w-4xl flex flex-col sm:flex-row items-center gap-8 rounded-3xl border border-black/5 bg-surface-muted p-6 sm:p-8">
                <Image
                    className="w-full sm:w-[45%] max-w-100 rounded-2xl"
                    src="/images/clientTransformation/daryushTransformation.png"
                    alt="name"
                    width={600} height={600}
                />
                <div className="w-full sm:w-[55%]">
                    <Quotes size={28} weight="fill" className="text-ink-strong/15" />
                    <p className="pt-2 text-base sm:text-lg whitespace-pre-line italic leading-relaxed">
                        I used to think I just had "bad genetics".
                        I tried bulking on my own before, but all I gained was fat.
                        With Yevhenii's training and nutrition plan, I started seeing real changes.
                        Every week was well-structured, and I felt supported every step of the way.
                        Trust me — this guy knows exactly how to help you become the best version of yourself.
                    </p>
                    <p className="pt-5 text-end italic text-sm sm:text-base text-ink-strong/60">-Daryush</p>
                </div>
            </div>
        </motion.section>
    )
}

export default ClientTransformationSection
