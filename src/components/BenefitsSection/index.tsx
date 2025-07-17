import { benefitsSteps } from "@/data/benefitsSteps"
import { BenefitsStepsType } from "@/types/benefits"
import { babes } from "@/app/fonts"
import { itemsContainerStyles, 
         itemsWrapperStyles, 
         itemStepStyles,
         itemTitleStyles, 
         itemDescriptionStyles,
         itemImageStyles,
         mainTitleStyles} from "./styles"
import Image from "next/image"

const BenefitsSection = () => {
    return(
        <section className="px-20 py-10 max-sm:px-5">
            <h2 className={`${babes.className} ${mainTitleStyles}`}>How it works</h2>
            <div className={itemsContainerStyles}>
                {benefitsSteps.map((item:BenefitsStepsType, index:number) => (
                    <div className={itemsWrapperStyles} key={index}>
                        <p className={itemStepStyles}>{item.step}</p>
                        <h3 className={itemTitleStyles}>{item.title}</h3>
                        <p className={itemDescriptionStyles}>{item.description}</p>
                        <Image className={itemImageStyles} src={item.image} alt={item.title} width={1500} height={1500}/>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default BenefitsSection