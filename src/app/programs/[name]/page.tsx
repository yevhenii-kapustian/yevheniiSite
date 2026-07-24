'use client'

import { useParams } from "next/navigation"
import { useProductsData } from "@/hooks/useProductsData"
import Products from "@/components/Products"
import Button from "@/components/Button"
import Link from "next/link"
import slugify from 'slugify'
import { babes } from "@/app/fonts"
import LoadingIcons from 'react-loading-icons'

export default function ProductPage () {
    const params = useParams<{name: string}>()
    const name = decodeURIComponent(params?.name || "")

    const { products: allProducts, loading } = useProductsData()
    const productSlug = allProducts.find(p => slugify(p.name, {strict: true, lower: true}) === name)
    const relatedProducts = allProducts.filter(p => p !== productSlug)

    if (loading) {
        return (
            <section className="flex justify-center px-5 py-24">
                <LoadingIcons.Oval stroke="currentColor" />
            </section>
        )
    }

    if (!productSlug) {
        return(
            <section className="flex flex-col items-center gap-4 px-5 py-24 text-center">
                <h1 className="text-xl sm:text-2xl font-semibold text-ink-strong/80">We couldn&apos;t find that program</h1>
                <p className="text-sm sm:text-base text-ink-strong/60">It may have been renamed or removed.</p>
                <Button href="/programs" variant="solid" size="sm" className="mt-2">
                    Browse all programs
                </Button>
            </section>
        )
    }

    return(
        <section className="px-5 sm:px-10 lg:px-20 py-16">
            <Products showPath={true} variants="product" product={[productSlug]}/>

            <div className="mt-20 border-t border-black/[0.06] pt-12">
                <div className="flex items-end justify-between gap-4 pb-8">
                    <div className="flex flex-col gap-2">
                        <h3 className={`${babes.className} text-2xl sm:text-3xl leading-[0.95] text-ink-strong`}>You might also like</h3>
                    </div>
                    <Link
                        href="/programs"
                        className="hidden shrink-0 text-sm font-semibold text-ink-strong/60 underline underline-offset-4 transition-colors duration-200 hover:text-ink-strong sm:block"
                    >
                        View all
                    </Link>
                </div>
                <Products showPath={false} showBuy={false} showDescription={false} variants="related" product={relatedProducts}/>
            </div>
        </section>
    )
}
