'use client'

import Image from "next/image"
import Link from "next/link"
import { babes } from "@/app/fonts"
import { motion } from "framer-motion"
import { useProductsData } from "@/hooks/useProductsData"
import { fromattedCurrancy } from "@/utils/currency"
import { ArrowRight } from "@phosphor-icons/react"
import slugify from "slugify"

const SKELETON_COUNT = 5

const ProgramsContent = () => {
    const { products, loading } = useProductsData()

    return(
        <section className="px-5 sm:px-10 lg:px-20 py-16">
            <motion.div
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mx-auto flex max-w-5xl flex-col items-start gap-4 text-left"
            >
                <h1 className={`${babes.className} text-5xl sm:text-6xl leading-[0.95] text-ink-strong`}>All Programs</h1>
                <p className="max-w-2xl text-sm sm:text-base text-ink-strong/70">
                    Structured, step-by-step plans built on real training and nutrition principles — pick the one that matches your goal.
                </p>
            </motion.div>

            <div className="mx-auto mt-16 flex max-w-5xl flex-col divide-y divide-black/[0.06]">
                {loading ? (
                    Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                        <div
                            key={index}
                            className={`flex flex-col gap-8 py-12 first:pt-0 last:pb-0 md:flex-row md:items-center md:gap-16 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                        >
                            <div className="aspect-[4/3] w-full animate-pulse rounded-3xl bg-black/5 md:w-1/2"/>
                            <div className="flex w-full flex-col gap-3 md:w-1/2">
                                <div className="h-3 w-6 animate-pulse rounded-full bg-black/10"/>
                                <div className="h-8 w-2/3 animate-pulse rounded-full bg-black/10"/>
                                <div className="h-4 w-full animate-pulse rounded-full bg-black/10"/>
                                <div className="h-4 w-1/4 animate-pulse rounded-full bg-black/10"/>
                            </div>
                        </div>
                    ))
                ) : products.map((item, index) => {
                    const isEven = index % 2 === 0
                    const teaser = item.description.split("\n")[0]?.replace(/^•\s*/, "").trim()

                    return (
                        <Link
                            key={item.id}
                            href={`/programs/${slugify(item.name, { lower: true, strict: true })}`}
                            className={`group flex flex-col gap-8 py-12 first:pt-0 last:pb-0 md:flex-row md:items-center md:gap-16 ${!isEven ? "md:flex-row-reverse" : ""}`}
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl md:w-1/2">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                                <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-sm font-semibold text-ink-strong shadow-sm backdrop-blur-sm">
                                    {fromattedCurrancy(item.price)}
                                </span>
                            </div>
                            <div className="flex w-full flex-col items-start gap-3 md:w-1/2">
                                <span className="text-xs font-semibold text-ink-strong/30">0{index + 1}</span>
                                <h3 className={`${babes.className} text-3xl sm:text-4xl leading-[0.95] text-ink-strong`}>{item.name}</h3>
                                {teaser && <p className="text-sm sm:text-base text-ink-strong/70">{teaser}</p>}
                                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-ink-strong">
                                    View Program
                                    <ArrowRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-1"/>
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}

export default ProgramsContent
