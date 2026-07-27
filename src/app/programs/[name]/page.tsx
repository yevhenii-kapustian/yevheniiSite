import type { Metadata } from "next"
import slugify from "slugify"
import { getAllProductBasics } from "@/supabase/queries"
import ProductPageContent from "./ProductPageContent"

const getProductBySlug = async (slug: string) => {
    const data = await getAllProductBasics()
    return data?.find(item => slugify(item.name, { lower: true, strict: true }) === slug) ?? null
}

type PageProps = {
    params: Promise<{ name: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { name } = await params
    const product = await getProductBySlug(decodeURIComponent(name))

    if (!product) {
        return { title: "Program Not Found - Yevhenii Fit" }
    }

    const teaser = product.description.split("\n")[0]?.replace(/^•\s*/, "").trim()

    return {
        title: `${product.name} - Online Coaching & Fitness Programs`,
        description: teaser || `${product.name} — a digital training and nutrition program by Yevhenii Fit.`,
        openGraph: {
            title: product.name,
            description: teaser,
            images: [{ url: product.image }],
        },
    }
}

export default function ProductPage () {
    return <ProductPageContent/>
}
