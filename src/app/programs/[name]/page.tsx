import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import slugify from "slugify"
import ProductPageContent from "./ProductPageContent"

const getSupabase = () => createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const getProductBySlug = async (slug: string) => {
    const supabase = getSupabase()
    const { data } = await supabase.from("products").select("name, description, image")
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
