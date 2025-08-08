import Image from 'next/image'
import { babes } from '../fonts'
import Link from 'next/link'
import { aboutContainerStyles,
        aboutItemsWrapperStyles,
        aboutItemsImageStyles,
        aboutItemsTextWrapperStyles,
        aboutItemsTextDescriptionStyles,
        aboutItemsButtonsWrapper,
        aboutButtonStyles
 } from './styles'

export const metadata = {
    title: "About - Online Coaching & Fitness Programs",
    description: "Meet Yevhenii — a transformation coach who turned personal struggle into real results. Discover his journey from self-doubt to strength and how he helps others build muscle, burn fat, and boost confidence — with no fluff, just what works.",
}

const About = () => {
    return(
        <section className={aboutContainerStyles}>
            <div className={aboutItemsWrapperStyles}>
                <Image className={aboutItemsImageStyles} src="/images/about/myTransformation.png" alt='' width={1000} height={1000}/>
                <div className={aboutItemsTextWrapperStyles}>
                    <h1 className={`${babes.className} text-5xl font-extrabold`}>
                        Hey! I'm Yevhenii
                    </h1>
                    <p className={aboutItemsTextDescriptionStyles}>
                        And not long ago, I was exactly where many people are right now: frustrated with my body, confused by all the fitness noise, and stuck in a cycle of trying and failing.
                        But I refused to stay there.
                    </p>
                    <p className={aboutItemsTextDescriptionStyles}>
                        Through years of self-education, trial and error, and full dedication to training and nutrition — I transformed my own body and mindset. Along the way, I learned what actually works — not just in theory, but in real life.
                        I've since helped others achieve the same — building muscle, dropping fat, and gaining confidence, even with no prior gym experience.
                    </p>
                    <p className={aboutItemsTextDescriptionStyles}>
                        What I do have is personal experience, results that speak for themselves, and the passion to help you get where you want to be.
                        No more confusion. No more excuses. Just a clear path forward — and a coach who's been through it himself.
                    </p>
                    <p className={aboutItemsTextDescriptionStyles}>
                        Let's build your transformation together.
                    </p>
                    <div className={aboutItemsButtonsWrapper}>
                        <Link href="/#formCoaching" className={aboutButtonStyles}>Personal Plan</Link>
                        <Link href="/programs" className={aboutButtonStyles}>View All Plans</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default About