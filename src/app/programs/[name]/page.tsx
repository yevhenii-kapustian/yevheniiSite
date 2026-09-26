import type { Metadata } from "next"
import { notFound } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Page Not Found - Yevhenii Fit",
    }
}

export default function ProductPage () {
    notFound()
}
