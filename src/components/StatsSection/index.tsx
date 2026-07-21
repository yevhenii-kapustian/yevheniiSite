'use client'

import { CalendarCheck, Barbell, ChartLineUp } from "@phosphor-icons/react";
import { babes } from "@/app/fonts";
import { motion, useInView } from 'framer-motion'
import { useRef } from "react";

const stats = [
    { icon: CalendarCheck, value: "92%", title: "of clients report more", subtitle: "consistency with exercise*" },
    { icon: Barbell, value: "89%", title: "of clients report", subtitle: "increased strength*" },
    { icon: ChartLineUp, value: "73%", title: "of clients report", subtitle: "boosted confidence*" },
]

const StatsSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <motion.section
            ref={ref}
            initial={{y: 32, opacity: 0}}
            animate={isInView ? {y: 0, opacity: 1} : {}}
            transition={{duration: 0.6, ease: "easeOut"}}
            className="py-16 px-5 sm:px-10 bg-surface-strong text-white"
        >
            <h2 className={`${babes.className} text-3xl sm:text-4xl text-center`}>A stronger, healthier, and more confident <span>you</span></h2>
            <div className="mx-auto max-w-4xl pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map(({icon: Icon, value, title, subtitle}) => (
                    <div key={subtitle} className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-surface p-6 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                            <Icon size={20} />
                        </div>
                        <p className="text-3xl font-bold">{value}</p>
                        <p className="text-sm text-white/60">{title}<br/>{subtitle}</p>
                    </div>
                ))}
            </div>
            <p className="pt-8 text-center text-xs text-white/40">*survey feedback shows strong approval of Yevhenii's coaching results</p>
        </motion.section>
    )
}

export default StatsSection
