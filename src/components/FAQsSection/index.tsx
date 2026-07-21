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
                        className="px-5 py-16 flex flex-col items-center"
        >
            <h2 className={`${babes.className} text-3xl sm:text-4xl text-center`}>FAQs</h2>
             <div className="w-full sm:w-[90%] lg:w-[70%] pt-10 flex flex-col gap-3">
                {faqs.map((item, index) => {
                    const isOpen = isIndexActive === index
                    return (
                    <div className="rounded-2xl bg-surface-muted overflow-hidden" key={index}>
                        <button
                            onClick={() => handleClick(index)}
                            aria-expanded={isOpen}
                            className="w-full flex justify-between items-center gap-3 px-5 py-4 text-left cursor-pointer"
                        >
                            <h4 className="text-base sm:text-lg font-semibold">{item.question}</h4>
                            <CaretDown
                                className={`shrink-0 text-ink-strong/50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                                size={18}
                                weight="bold"
                            />
                        </button>
                        <AnimatePresence initial={false}>
                                {isOpen && <motion.div initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.3, ease: "linear" }}
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
