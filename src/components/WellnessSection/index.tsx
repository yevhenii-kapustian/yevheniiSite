'use client'

import { babes } from "@/app/fonts";
import Products from "../Products";
import Link from "next/link";
import Reveal from "@/components/animation/Reveal";

const WellnessSection = () => {
    return(
        <section className="relative overflow-hidden">
            <div className="py-10 px-5 lg:px-20 flex flex-col items-center gap-5 sm:flex-row sm:justify-evenly bg-white">
                <div className="w-full sm:w-[40%] lg:w-[25%] flex flex-col gap-3">
                    <h2 className={`${babes.className} text-4xl sm:text-5xl leading-[0.95] text-ink uppercase`}>Invest in Your Health Today</h2>
                    <p className="text-sm sm:text-base">
                        Your body is your most valuable asset. Start building long-term strength, energy, and resilience — one healthy
                        choice at a time. Small daily actions lead to powerful results. Make your health a priority, starting now.
                    </p>
                    <Link className="size-fit font-semibold text-sm sm:text-base uppercase underline underline-offset-6" href="/get-started">Find Your Plan</Link>
                </div>
                <Reveal
                    className="w-full sm:w-[60%] lg:w-[75%] max-w-[1000px] flex items-center gap-3 sm:gap-8"
                >
                    <Products showArrows={true} showDescription={false} showBuy={false}/>
                </Reveal>
            </div>
        </section>
    )
}

export default WellnessSection
