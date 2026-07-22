'use client'

import { babes } from "@/app/fonts"
import { useRef, useState } from "react"
import { CaretDown } from "@phosphor-icons/react";
import { faqs } from "@/data/faqs";
import {motion, AnimatePresence, useInView} from "framer-motion"

const FAQs = () => {
    const [isIndexActive, setIsIndexActive] = useState<number | null>(null)

    const handleClick = (index:number): void => {
       setIsIndexActive((prevIndex) => (prevIndex === index ? null : index))
    }

    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <motion.section
                        ref={ref}
                        initial={{y: 32, opacity: 0}}
                        animate={isInView ? {y: 0, opacity: 1} : {}}
                        transition={{duration: 0.6, ease: "easeOut"}}
                        className="px-5 sm:px-10 lg:px-20 py-16 flex flex-col items-center"
        >
            <div className="flex flex-col items-center gap-3 text-center">
                <h2 className={`${babes.className} text-4xl sm:text-5xl leading-[0.95] text-ink-strong`}>Frequently Asked Questions</h2>
            </div>
             <div className="w-full sm:w-[90%] lg:w-[70%] pt-10 flex flex-col gap-3">
                {faqs.map((item, index) => {
                    const isOpen = isIndexActive === index
                    return (
                    <div
                        className="rounded-2xl border border-black/5 bg-white transition-shadow duration-200 hover:shadow-sm overflow-hidden"
                        key={index}
                    >
                        <button
                            onClick={() => handleClick(index)}
                            aria-expanded={isOpen}
                            className="w-full flex justify-between items-center gap-3 px-5 py-4 text-left cursor-pointer"
                        >
                            <h4 className="text-base sm:text-lg font-semibold text-ink-strong">{item.question}</h4>
                            <span className={`shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-black/[0.04] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                                <CaretDown
                                    className="text-ink-strong/60"
                                    size={14}
                                    weight="bold"
                                />
                            </span>
                        </button>
                        <AnimatePresence initial={false}>
                                {isOpen && <motion.div initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    >
                                                        <p className="px-5 pb-4 text-sm sm:text-base text-ink-strong/70">
                                                            {item.answer}
                                                        </p>
                                                    </motion.div>
                                }
                        </AnimatePresence>
                    </div>
                )})}
            </div>
        </motion.section>
    )
}

export default FAQs
