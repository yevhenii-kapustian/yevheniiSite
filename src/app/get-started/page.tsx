import type { Metadata } from "next"
import Form from "@/components/Form/form"

export const metadata: Metadata = {
    title: "Get Started - Online Coaching & Fitness Programs",
    description: "Answer a few quick questions and I'll personally reach out to help you find the right training and nutrition plan for your goals.",
}

const GetStarted = () => {
    return (
        <Form/>
    )
}

export default GetStarted
