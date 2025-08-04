import { babes } from "@/app/fonts"
import { useRef, useState } from "react"
import { ArrowDown } from "@phosphor-icons/react";
import { faqs } from "@/data/faqs";
import {motion, AnimatePresence, useInView} from "framer-motion"
import { fqasContainerStyles, 
        fqasTitleStyles, 
        fqasItemsContainerStyles,
        fqasItemsWrapperStyles,
        fqasItemsTitleWrapperStyles,
        fqasItemsTitleStyles,
        fqasItemsTitleArrowStyles } from "./styles";

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
                        initial={{y: -100, opacity: 0}}
                        animate={isInView ? {y: 0, opacity: 1} : {}}
                        transition={{duration: 0.5}}    
                        className={fqasContainerStyles}
        >
            <h2 className={`${babes.className} ${fqasTitleStyles}`}>FAQs</h2>
             <div className={fqasItemsContainerStyles}>
                {faqs.map((item, index) => (
                    <div className={fqasItemsWrapperStyles} key={index}>
                        <div onClick={() => handleClick(index)} className={fqasItemsTitleWrapperStyles}>
                            <h4 className={fqasItemsTitleStyles}>{item.question}</h4>
                            <ArrowDown className={`${fqasItemsTitleArrowStyles} ${isIndexActive === index && "rotate-180"}`} size={32}/>
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
        </motion.section>
    )
}

export default FAQs