import { useState } from "react"
import Button from "@/components/Button"
import type { QuizAnswers } from "@/types/form"

type MultiSelectStepProps = {
    question: string
    options: string[]
    fieldKey: string
    onNext: (values: QuizAnswers) => void
}

const MultiSelectStep = ({ question, options, fieldKey, onNext }: MultiSelectStepProps) => {
    const [selected, setSelected] = useState<string[]>([])

    const toggle = (option: string) => {
        setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }

    return (
        <div className="flex flex-col justify-center gap-6">
            <h4 className="text-center text-lg sm:text-xl font-semibold">{question}</h4>
            <div className="flex flex-wrap justify-center gap-3">
                {options.map(option => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => toggle(option)}
                        className={`rounded-full border-2 px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${selected.includes(option) ? "border-white bg-white text-black" : "border-white/20 text-white/70"}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <Button
                variant="solid-light"
                size="sm"
                className="mx-auto w-full sm:w-fit"
                disabled={selected.length === 0}
                onClick={() => onNext({ [fieldKey]: selected.join(",") })}
            >
                Continue
            </Button>
        </div>
    )
}

export default MultiSelectStep
