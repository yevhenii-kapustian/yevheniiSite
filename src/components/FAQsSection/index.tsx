import { babes } from "@/app/fonts"
import { useState } from "react"
import { ArrowDown } from "@phosphor-icons/react";
import { faqs } from "@/data/faqs";
import {motion, AnimatePresence} from "framer-motion"

const FAQs = () => {
    const [isIndexActive, setIsIndexActive] = useState<number | null>(null)

    const handleClick = (index:number): void => {
       setIsIndexActive((prevIndex) => (prevIndex === index ? null : index))
    }

    return(
        <section className="px-5 py-10 flex flex-col items-center">
            <h2 className={`${babes.className} text-6xl text-center`}>FAQs</h2>
             <div className="w-[70%] pt-10 flex flex-col gap-5 max-[1025px]:w-[90%] max-sm:w-full">
                {faqs.map((item, index) => (
                    <div className="p-5 bg-[#F0F0F0] rounded-xl" key={index}>
                        <div onClick={() => handleClick(index)} className="flex justify-between items-center gap-2 cursor-pointer">
                            <h4 className="text-2xl font-extrabold max-sm:text-xl">{item.question}</h4>
                            <ArrowDown className={`min-w-10 transition-all delay-100 duration-400 ease-in-out ${isIndexActive === index && "rotate-180"}`} size={32}/>
                        </div>
                        <AnimatePresence initial={false}>

                                {isIndexActive === index && <motion.div initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    transition={{ duration: 0.3, ease: "linear" }}
                                                    >
                                                        <p className="pt-2">
                                                            {item.answer}
                                                        </p> 
                                                    </motion.div>
                                }
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default FAQs