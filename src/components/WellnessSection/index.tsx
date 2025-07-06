import { babes } from "@/app/fonts";
import Products from "../Products";
import Link from "next/link";
import { wellnessContainerStyles, 
         wellnessTextWrapperStyles, 
         wellnessButtonStyles,
         productContainer } from "./styles";

const WellnessSection = () => {
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
            <div className={productContainer}>
                <Products showPrice={false} showBuy={false} showName={false}/>
            </div>
        </section>
    )
}

export default WellnessSection