import type { Metadata } from "next"
import Form from "@/components/Form/form"

export const metadata: Metadata = {
    title: "Get Started - Online Coaching & Fitness Programs",
    description: "Answer a few quick questions and get a personalized training and nutrition plan built around your goals.",
}

const GetStarted = () => {
    return (
        <Form/>
    )
}

export default GetStarted
