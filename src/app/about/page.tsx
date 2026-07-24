import Image from 'next/image'
import { babes } from '../fonts'
import Button from '@/components/Button'

export const metadata = {
    title: "About - Online Coaching & Fitness Programs",
    description: "Meet Yevhenii — a transformation coach who turned personal struggle into real results. Discover his journey from self-doubt to strength and how he helps others build muscle, burn fat, and boost confidence — with no fluff, just what works.",
}

const highlights = [
    {
        title: "Real experience",
        description: "I've been through it myself — not just theory, but real, lived experience.",
    },
    {
        title: "No more confusion",
        description: "No more excuses, no more guessing. Just a clear path forward.",
    },
    {
        title: "Results that speak",
        description: "Real transformations — mine, and everyone I've coached since.",
    },
]

const About = () => {
    return(
        <section className="px-5 sm:px-10 lg:px-20 py-16">
            <div className="mx-auto flex max-w-6xl flex-col gap-12 md:flex-row md:items-center md:gap-16">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl md:w-[45%]">
                    <Image
                        className="object-cover"
                        src="/images/about/myTransformation.png"
                        alt="Yevhenii's transformation"
                        fill
                        priority
                    />
                </div>
                <div className="flex w-full flex-col items-start gap-5 md:w-[55%]">
                    <span className="flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-ink-strong/60">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-strong/60" />
                        About Yevhenii
                    </span>
                    <h1 className={`${babes.className} text-5xl sm:text-6xl leading-[0.95] text-ink-strong`}>
                        Hey! I&apos;m Yevhenii
                    </h1>
                    <p className="text-sm sm:text-base leading-relaxed text-ink-strong/80">
                        Not long ago, I was exactly where many people are right now: frustrated with my body, confused by all the fitness noise, and stuck in a cycle of trying and failing. But I refused to stay there.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-ink-strong/80">
                        Through years of self-education, trial and error, and full dedication to training and nutrition — I transformed my own body and mindset. Along the way, I learned what actually works — not just in theory, but in real life. I&apos;ve since helped others achieve the same — building muscle, dropping fat, and gaining confidence, even with no prior gym experience.
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-ink-strong">
                        Let&apos;s build your transformation together.
                    </p>
                    <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:gap-4">
                        <Button href="/get-started" variant="solid" size="sm" className="h-12 w-full sm:w-auto">Personal Plan</Button>
                        <Button href="/programs" variant="outline-dark" size="sm" className="h-12 w-full sm:w-auto">View All Plans</Button>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-20 grid max-w-6xl gap-10 border-t border-black/[0.06] pt-16 sm:grid-cols-3">
                {highlights.map(item => (
                    <div key={item.title} className="flex flex-col gap-2">
                        <h3 className={`${babes.className} text-2xl leading-[0.95] text-ink-strong`}>{item.title}</h3>
                        <p className="text-sm sm:text-base text-ink-strong/70">{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}
export default About
