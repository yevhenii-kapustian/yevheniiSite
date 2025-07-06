'use client'

import { useParams } from "next/navigation"
import { products } from "@/data/products"
import Products from "@/components/Products"

export default function ProductPage () {
    const params = useParams<{name: string}>()
    const name = decodeURIComponent(params?.name || "")

    const allProducts = products.get("plans")
    const product = allProducts?.find(p => p.name.toLocaleLowerCase() === name)

    return(
        <section className="pt-[80px]">
            <Products product={product ? [product] : []}/>
        </section>
    )
}