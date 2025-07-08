import { babes } from "@/app/fonts";
import Products from "../Products";
import Link from "next/link";
import { easeInOut, motion, useInView } from "framer-motion";
import { wellnessContainerStyles, 
         wellnessTextWrapperStyles, 
         wellnessButtonStyles,
         productContainer } from "./styles";
import { useEffect, useRef, useState } from "react";
import { productVisibility } from "./animation";

const WellnessSection = () => {

    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})
    const [isMobileWidth, setIsMobileWidth] = useState<boolean>(false)

    useEffect(() => {
        const handleWidth = () => {
            if (window.innerWidth > 1000) {
                setIsMobileWidth(true)
            } 
        }

        handleWidth()

    })
    

    return(
        <section className="relative overflow-hidden">
            <motion.div
                    initial={{
                            scale: 1,
                            }}
                    transition={{
                                duration: 0.5,
                                ease: easeInOut
                                }}
                    viewport={{
                                amount: 0.5
                            }}
                    whileInView={isMobileWidth ? {scale: 1.05} : {scale: 1}}
                    className={wellnessContainerStyles}>

                <div className={wellnessTextWrapperStyles}>
                    <h2 className={`${babes.className} text-7xl uppercase max-[1201]:text-6xl max-md:text-6xl`}>Invest in Your Health Today</h2>
                    <p>
                        Your body is your most valuable asset. Start building long-term strength, energy, and resilience — one healthy
                        choice at a time. Small daily actions lead to powerful results. Make your health a priority, starting now.
                    </p>
                    <Link className={wellnessButtonStyles} href="/programs">Find Your Plan</Link>
                </div>
                <motion.div
                    ref={ref}
                    className={productContainer}
                    variants={productVisibility}
                    initial='hidden'
                    animate={isInView ? "visible" : "hidden"}
                    >
                    <Products showPrice={false} showBuy={false} showName={false}/>
                </motion.div>
            </motion.div>
        </section>
    )
}

export default WellnessSection