'use client'

import { useParams } from "next/navigation"
import { products } from "@/data/products"
import Products from "@/components/Products"
import slugify from 'slugify'
import { babes } from "@/app/fonts"

export default function ProductPage () {
    const params = useParams<{name: string}>()
    const name = decodeURIComponent(params?.name || "")

    const allProducts = products.get("plans")
    const productSlug = allProducts?.find(p => slugify(p.name, {strict: true, lower: true}) === name)

    return(
        <section className="pt-10 pb-16 px-5 lg:px-15 h-full">
            <div>
                <Products showPath={true} variants="product" product={productSlug ? [productSlug] : []}/>
            </div>
            <h3 className={`${babes.className} mt-16 text-2xl sm:text-3xl text-center`}>You might also like</h3>
            <div className="mt-10">
                <Products showPath={false} showBuy={false} showDescription={false} variants="home"/>
            </div>
        </section>
    )
}