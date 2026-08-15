import type { Metadata } from "next"
import SetupForm from "@/components/Form/SetupForm"

export const metadata: Metadata = {
    title: "Set Up Your Plan - Yevhenii Fit",
}

export default function SetupPage () {
    return <SetupForm/>
}
