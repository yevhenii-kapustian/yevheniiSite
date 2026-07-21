import Image from 'next/image'
import { babes } from '../fonts'
import Button from '@/components/Button'

export const metadata = {
    title: "About - Online Coaching & Fitness Programs",
    description: "Meet Yevhenii — a transformation coach who turned personal struggle into real results. Discover his journey from self-doubt to strength and how he helps others build muscle, burn fat, and boost confidence — with no fluff, just what works.",
}

const About = () => {
    return(
        <section className="pt-10 pb-16">
            <div className="mx-5 sm:mx-8 flex flex-col md:flex-row justify-center gap-10">
                <Image className="w-full md:w-[50%] max-w-130 rounded-3xl object-contain" src="/images/about/myTransformation.png" alt="" width={1000} height={1000}/>
                <div className="w-full md:w-150 flex flex-col gap-5">
                    <span className="text-xs font-semibold uppercase tracking-wide text-ink-strong/40">About</span>
                    <h1 className={`${babes.className} text-4xl sm:text-5xl`}>
                        Hey! I'm Yevhenii
                    </h1>
                    <p className="text-sm sm:text-base leading-relaxed text-ink-strong/80">
                        And not long ago, I was exactly where many people are right now: frustrated with my body, confused by all the fitness noise, and stuck in a cycle of trying and failing.
                        But I refused to stay there.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-ink-strong/80">
                        Through years of self-education, trial and error, and full dedication to training and nutrition — I transformed my own body and mindset. Along the way, I learned what actually works — not just in theory, but in real life.
                        I've since helped others achieve the same — building muscle, dropping fat, and gaining confidence, even with no prior gym experience.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-ink-strong/80">
                        What I do have is personal experience, results that speak for themselves, and the passion to help you get where you want to be.
                        No more confusion. No more excuses. Just a clear path forward — and a coach who's been through it himself.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-ink-strong/80">
                        Let's build your transformation together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button href="/#formCoaching" variant="solid">Personal Plan</Button>
                        <Button href="/programs" variant="outline-dark">View All Plans</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default About
