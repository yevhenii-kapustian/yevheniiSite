import { babes } from "@/app/fonts";
import Products from "../Products";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { wellnessContainerStyles, 
         wellnessTextWrapperStyles, 
         wellnessButtonStyles,
         productContainer } from "./styles";
import { useRef } from "react";
import { productVisibility } from "./animation";

const WellnessSection = () => {

    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <section className={wellnessContainerStyles}>
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
        </section>
    )
}

export default WellnessSection