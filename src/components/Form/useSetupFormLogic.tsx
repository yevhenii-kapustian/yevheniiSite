import { formSteps as allFormSteps } from "@/data/form"
import { QuizAnswers } from "@/types/form"
import { useState } from "react"

// Same quiz as /get-started, minus name/email — those are already known for a logged-in user.
const formSteps = allFormSteps.filter(step => step.key !== "name" && step.key !== "email")

export default function useSetupFormLogic () {
    const [step, setStep] = useState<number>(0)
    const [answers, setAnswers] = useState<QuizAnswers>({})
    const [input, setInput] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const currentQuestions = formSteps[step];
    const isLastStep = step === formSteps.length - 1

    const completeSetup = async (finalAnswers: QuizAnswers) => {
        setLoading(true)
        setError('')

        try {
            const res = await fetch("/api/complete-setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalAnswers),
            })

            if (!res.ok) throw new Error("Setup failed")

            // Hard navigation on purpose: a client-side router.push can serve /my-profile
            // from Next's Router Cache (prefetched by the header nav before the webhook
            // granted the entitlement), showing the stale "no access yet" state.
            window.location.href = "/my-profile"
        } catch {
            setError("Something went wrong — please try again.")
            setLoading(false)
        }
    }

    const handleNext = (values: QuizAnswers): void => {
        const nextAnswers = { ...answers, ...values }
        setAnswers(nextAnswers)
        setInput('')

        if (isLastStep) {
            completeSetup(nextAnswers)
            return
        }

        setStep(prev => prev + 1)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (currentQuestions.type === "input") {
            handleNext({ [currentQuestions.key]: input })
        }
    }

    return {
        step,
        currentQuestions,
        input,
        loading,
        error,
        answers,
        formSteps,
        handleNext,
        setInput,
        handleSubmit,
    }
}
