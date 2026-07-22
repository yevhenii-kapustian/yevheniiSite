import { formMerged } from "@/data/form"
import { FormType } from "@/types/form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const REDIRECT_DELAY_MS = 2500

export default function useFormLogic () {
        const router = useRouter()
        const [step, setStep] = useState<number>(0)
        const [answers, setAnswers] = useState<string[]>([])
        const [input, setInput] = useState<string>('')
        const [loading, setLoading] = useState<boolean>(false)
        const [submitted, setSubmitted] = useState<boolean>(false)
        const [honeypot, setHoneypot] = useState<string>('')

        const currentQuestions:FormType = formMerged[step];

        useEffect(() => {
            if (submitted) {
                const timer = setTimeout(() => {
                    router.push("/programs")
                }, REDIRECT_DELAY_MS)
                return () => clearTimeout(timer)
            }
        }, [submitted, router])
    
        const postFormData = async (data: object) => {
            const response = await fetch("/api/form", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })
            return await response.json()
        }
    
        const handleNext = (value:string): void => {
            if (currentQuestions.type === "button") {
                setAnswers(prev => [...prev, value])
                setStep(prev => prev + 1);
            }
    
            if (currentQuestions.type === "input") {
                setAnswers([...answers, input])
                setInput('')
                setStep(prev => prev + 1);
            }
        }
    
        const handleSubmit = async (e:React.FormEvent) => {
            e.preventDefault()
            if (loading) return

            const formKeys = [
                "goal",
                "gender",
                "age",
                "motivation",
                "instagramInstalled",
                "name",
                "email",
                "instagram"
            ]

            const fullAnswer = [...answers]
            if (input.trim() !== "") {
                fullAnswer.push(input.trim())
            }

            const formData: {[key: string]: string} = {}

            for (let i = 0; i < formKeys.length; i++) {
                formData[formKeys[i]] = fullAnswer[i] || ""
            }

            formData.website = honeypot

            try {
                setLoading(true)
                const res = await postFormData(formData)

                if (res.message === "Success") {
                    setSubmitted(true)
                    setStep(0);
                    setAnswers([]);
                    setInput('');
                    setHoneypot('');
                } else {
                    setSubmitted(false)
                }
            } catch (error) {
                console.log(`Form Error: ${error}`);
            } finally {
                setLoading(false)
            }
        }

        return {
            step,
            currentQuestions,
            input,
            loading,
            submitted,
            formMerged,
            handleNext,
            setInput,
            handleSubmit,
            honeypot,
            setHoneypot
        }
}