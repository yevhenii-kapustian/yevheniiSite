'use client'

import { useEffect, useState } from "react"
import { ProductsType } from "@/types/products"

export const useProductsData = (enabled: boolean = true) => {
    const [products, setProducts] = useState<ProductsType[]>([])
    const [loading, setLoading] = useState(enabled)

    useEffect(() => {
        if (!enabled) return

        let cancelled = false
        setLoading(true)

        fetch("/api/products")
            .then(res => res.json())
            .then((data: { products?: ProductsType[] }) => {
                if (!cancelled) setProducts(data.products ?? [])
            })
            .catch(error => console.log(error))
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [enabled])

    return { products, loading }
}
