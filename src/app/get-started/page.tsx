import type { Metadata } from "next"
import Form from "@/components/Form/form"

export const metadata: Metadata = {
    title: "Get Started - Online Coaching & Fitness Programs",
    description: "Answer a few quick questions and see your personalized training and nutrition plan come together in real time.",
}

const GetStarted = () => {
    return (
        <Form/>
    )
}

export default GetStarted
