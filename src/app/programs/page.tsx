import { notFound } from "next/navigation"

export const metadata = {
    title: "Page Not Found - Yevhenii Fit",
    description: "This page is not available.",
}

const Programs = () => {
    notFound()
}

export default Programs
