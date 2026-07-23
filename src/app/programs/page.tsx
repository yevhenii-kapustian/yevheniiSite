import Products from "@/components/Products"
import { babes } from "../fonts"

export const metadata = {
    title: "Programs - Online Coaching & Fitness Programs",
    description: "Discover science-based fitness programs designed to help you lose fat, build muscle, and boost energy. Find the perfect plan tailored to your goals and lifestyle.",
}

const Programs = () => {
    return(
        <section className="px-5 sm:px-10 lg:px-20 py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
                <h1 className={`${babes.className} text-4xl sm:text-5xl leading-[0.95] text-ink-strong`}>All Programs</h1>
                <p className="max-w-md text-sm sm:text-base text-ink-strong/70">
                    Structured, step-by-step plans built on real training and nutrition principles — pick the one that matches your goal.
                </p>
            </div>
            <div className="pt-12">
                <Products variants="programs" showBuy={false} showDescription={false}/>
            </div>
        </section>
    )
}

export default Programs
