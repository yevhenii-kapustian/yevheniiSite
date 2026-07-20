'use client'

import { CalendarCheck, Barbell, ChartLineUp } from "@phosphor-icons/react";
import { babes } from "@/app/fonts";
import { motion, useInView } from 'framer-motion'
import { useRef } from "react";

const StatsSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <motion.section
            ref={ref}
            initial={{y: 32, opacity: 0}}
            animate={isInView ? {y: 0, opacity: 1} : {}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="py-15 px-5 sm:px-10 bg-charcoal-strong text-white"
        >
            <h2 className={`${babes.className} text-3xl sm:text-4xl text-center`}>A stronger, healthier, and more confident <span>you</span></h2>
            <div className="pt-10 flex flex-col sm:flex-row justify-center gap-10 lg:gap-20">
                <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-full bg-steel">
                        <CalendarCheck size={32} />
                    </div>
                    <h4 className="pt-3 text-2xl sm:text-3xl font-bold">92%</h4>
                    <p className="text-sm sm:text-base">of clients report more</p>
                    <p className="text-sm sm:text-base font-bold">consistency with exercise*</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-full bg-steel">
                        <Barbell size={32}/>
                    </div>
                    <h4 className="pt-3 text-2xl sm:text-3xl font-bold">89%</h4>
                    <p className="text-sm sm:text-base">of clients report</p>
                    <p className="text-sm sm:text-base font-bold">increased strength*</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-full bg-steel">
                        <ChartLineUp size={32}/>
                    </div>
                    <h4 className="pt-3 text-2xl sm:text-3xl font-bold">73%</h4>
                    <p className="text-sm sm:text-base">of clients report</p>
                    <p className="text-sm sm:text-base font-bold">boosted confidence*</p>
                </div>
            </div>
            <h5 className="pt-10 text-center text-xs sm:text-sm">*survey feedback shows strong approval of Yevhenii's coaching results</h5>
        </motion.section>
    )
}

export default StatsSection
