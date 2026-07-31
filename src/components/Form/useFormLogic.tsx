import { formSteps, PRODUCT_ID_BY_CHOICE } from "@/data/form"
import { QuizAnswers } from "@/types/form"
import { useState } from "react"

export default function useFormLogic () {
        const [step, setStep] = useState<number>(0)
        const [answers, setAnswers] = useState<QuizAnswers>({})
        const [input, setInput] = useState<string>('')
        const [loading, setLoading] = useState<boolean>(false)
        const [error, setError] = useState<string>('')

        const currentQuestions = formSteps[step];
        const isLastStep = step === formSteps.length - 1

        const completeQuiz = async (finalAnswers: QuizAnswers) => {
            const selectedLabels = finalAnswers.productChoice?.split(",").filter(Boolean) ?? []
            const productIds = selectedLabels.map(label => PRODUCT_ID_BY_CHOICE[label]).filter(Boolean)

            if (productIds.length === 0) {
                setError("Please pick a plan.")
                return
            }

            setLoading(true)
            setError('')

            try {
                const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productIds, ...finalAnswers }),
                })
                const data = await res.json()

                if (!res.ok || !data.url) throw new Error(data.message || "Checkout failed")

                window.location.href = data.url
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
                completeQuiz(nextAnswers)
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
