import Image from "next/image"

import { imageStyles, bgGradient, mainSectionStyles, textMainStyles } from "./styles"
import { basicButtonStyles } from "@/styles/button"
import { babes } from "@/app/fonts"

type WelcomeSectionProps = {
    title: any,
    description: string
}

const WelcomeSection = ({title, description}:WelcomeSectionProps) => {
    return(
        <section className={`${mainSectionStyles}`}>
            <div>
                <Image className={`${imageStyles}`} src="/welcomeSection.jpg" alt="welcome image" fill priority/>
                <span className={`${bgGradient}`}/>
            </div>

            <div className={`${textMainStyles}`}>
                <h1 className={`${babes.className} text-7xl font-extrabold text-shadow-[0px_0px_12px_#00000070] text-white max-[1025px]:text-6xl max-sm:text-[47px]`}>{title}</h1>
                <h2 className="text-l text-shadow-[0px_0px_12px_#00000070] text-white max-[1025px]:text-[14px] w-[70%] max-[1200px]:w-full ">{description}</h2>
                <div className="flex gap-5">
                    <button className={`${basicButtonStyles} 
                                            bg-white 
                                            border-transparent
                                            hover:text-white 
                                            hover:bg-transparent 
                                            hover:border-white
                                        `}>
                            Get Started
                    </button>
                    <button className={`${basicButtonStyles} 
                                            text-white 
                                            border-white 
                                            hover:bg-white 
                                            hover:text-black
                                        `}>
                            My Account
                    </button>
                </div>
            </div>
        </section>
    )
}

export default WelcomeSection