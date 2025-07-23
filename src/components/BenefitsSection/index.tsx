import { benefitsSteps } from "@/data/benefitsSteps"
import { BenefitsStepsType } from "@/types/benefits"
import { babes } from "@/app/fonts"
import { itemsContainerStyles, 
         itemsWrapperStyles, 
         itemStepStyles,
         itemTitleStyles, 
         itemDescriptionStyles,
         itemImageStyles,
         mainTitleStyles,
         getLinkStyles} from "./styles"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from 'framer-motion'
import React, { useRef } from "react"

const BenefitsSection = () => {
    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    const handleClick = (e:React.MouseEvent<HTMLElement>): void => {
        e.preventDefault()
        const getFormInView = document.querySelector("#formCoaching")
        if (getFormInView) {
                getFormInView.scrollIntoView({block: "center", behavior: "smooth"})
        }
    }

    return(
        <motion.section
                        ref={ref} 
                        initial={{y: -100, opacity: 0}}
                        animate={isInView ? {y: 0, opacity: 1} : {}}
                        transition={{duration: 0.5}}
                        className="px-20 py-10 max-sm:px-5 flex flex-col items-center">
            <h2 className={`${babes.className} ${mainTitleStyles}`}>How it works</h2>
            <div className={itemsContainerStyles}>
                {benefitsSteps.map((item:BenefitsStepsType, index:number) => (
                    <div className={itemsWrapperStyles} key={index}>
                        <p className={itemStepStyles}>{item.step}</p>
                        <h3 className={itemTitleStyles}>{item.title}</h3>
                        <p className={itemDescriptionStyles}>{item.description}</p>
                        <Image className={itemImageStyles} src={item.image} alt={item.title} width={1500} height={1500} priority/>
                    </div>
                ))}
            </div>
            <Link scroll={false} onClick={handleClick} className={getLinkStyles} href="#formCoaching">Get My Personalized Plan</Link>
        </motion.section>
    )
}

export default BenefitsSection