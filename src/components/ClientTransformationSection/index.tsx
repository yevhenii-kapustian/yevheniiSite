import Image from "next/image"
import { babes } from "@/app/fonts"
import { transformContainerStyles,
        transformTitleStyles,
        transformSubtitleStyles,
        transformItemsContainerStyles,
        transformItemImageStyles,
        transformItemTextContainer,
        transformItemTextTitle,
        transformItemTextSubtitle
 } from "./styles"

const ClientTransformationSection = () => {
    return(
        <section className={transformContainerStyles}>
            <h2 className={`${babes.className} ${transformTitleStyles}`}>Client Transformation Spotlight</h2>
            <h3 className={transformSubtitleStyles}>Real words from someone who's lived the process</h3>
            <div className={transformItemsContainerStyles}>
                <Image className={transformItemImageStyles}
                        src="/images/clientTransformation/daryushTransformation.png" 
                        alt="name" 
                        width={600} height={600}
                />
                <div className={transformItemTextContainer}>
                    <h5 className={transformItemTextTitle}>
                        I used to think I just had "bad genetics".
                        I tried bulking on my own before, but all I gained was fat.
                        With Yevhenii's trainingx and nutrition plan, I started seeing real changes.
                        Every week was well-structured, and I felt supported every step of the way.
                        Trust me — this guy knows exactly how to help you become the best version of yourself.
                    </h5>
                    <p className={transformItemTextSubtitle}>-Daryush</p>
                </div>
            </div>
        </section>
    )
}

export default ClientTransformationSection