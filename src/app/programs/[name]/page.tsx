'use client'

import { useParams } from "next/navigation"
import { products } from "@/data/products"
import Products from "@/components/Products"
import slugify from 'slugify'

export default function ProductPage () {
    const params = useParams<{name: string}>()
    const name = decodeURIComponent(params?.name || "")

    const allProducts = products.get("plans")
    const productSlug = allProducts?.find(p => slugify(p.name, {strict: true, lower: true}) === name)

    return(
        <section className="pt-[80px]">
            <Products product={productSlug ? [productSlug] : []}/>
        </section>
    )
}