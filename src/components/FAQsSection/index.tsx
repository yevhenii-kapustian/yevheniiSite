'use client'

import { babes } from "@/app/fonts"
import { useRef, useState } from "react"
import { ArrowDown } from "@phosphor-icons/react";
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
                        className="px-5 py-10 flex flex-col items-center"
        >
            <h2 className={`${babes.className} text-3xl sm:text-4xl text-center`}>FAQs</h2>
             <div className="w-full sm:w-[90%] lg:w-[70%] pt-10 flex flex-col gap-5">
                {faqs.map((item, index) => (
                    <div className="p-5 bg-surface-muted rounded-xl" key={index}>
                        <div onClick={() => handleClick(index)} className="flex justify-between items-center gap-2 cursor-pointer">
                            <h4 className="text-base sm:text-lg font-semibold">{item.question}</h4>
                            <ArrowDown className={`min-w-10 transition-all delay-100 duration-400 ease-in-out ${isIndexActive === index && "rotate-180"}`} size={32}/>
                        </div>
                        <AnimatePresence initial={false}>

                                {isIndexActive === index && <motion.div initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.3, ease: "linear" }}
                                                    >
                                                        <p className="pt-2 text-sm sm:text-base">
                                                            {item.answer}
                                                        </p>
                                                    </motion.div>
                                }
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.section>
    )
}

export default FAQs
