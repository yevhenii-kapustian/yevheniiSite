import { FormType, QuizAnswers } from "@/types/form";
import React, {SetStateAction} from "react";
import Link from "next/link";
import Button from "@/components/Button";
import BodyStatsStep from "./BodyStatsStep";
import MultiSelectStep from "./MultiSelectStep";

type FormStepType = {
    currentQuestions: FormType,
    input: string,
    isLastStep: boolean,
    setInput: React.Dispatch<SetStateAction<string>>
    onNext: (values: QuizAnswers) => void,
}

export default function FormStep ({currentQuestions, onNext, setInput, input, isLastStep}:FormStepType) {
   if (currentQuestions.type === "visual") {
    return <BodyStatsStep onNext={onNext} />
   }

   if (currentQuestions.type === "multiselect") {
    return (
        <MultiSelectStep
            question={currentQuestions.question}
            options={currentQuestions.options}
            fieldKey={currentQuestions.key}
            onNext={onNext}
        />
    )
   }

   if (currentQuestions.type === "button") {
    return(
        <div className="flex flex-col justify-center gap-4">
            <h4 className="text-center text-lg sm:text-xl font-semibold">{currentQuestions.question}</h4>
            <div className="flex flex-wrap justify-center gap-3">
                {currentQuestions.options.map(item => (
                    <Button
                        variant="solid-light"
                        size="sm"
                        onClick={() => onNext({ [currentQuestions.key]: item })}
                        key={item}
                    >
                        {item}
                    </Button>
                ))}
            </div>
        </div>
    )
   }

   if (currentQuestions.type === "input") {
    const validateEmail = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim
    const isEmailField = currentQuestions.subtype === "email"
    const isEmailValidate = isEmailField ? validateEmail.test(input) : true
    const isButtonDisabled = input.trim() === "" || !isEmailValidate

    return(
        <div className="flex flex-col gap-5">
            <textarea className="p-3 rounded-2xl border border-white/15 bg-white/5 resize-none outline-none text-sm sm:text-base text-white placeholder:text-white/40"
                     rows={1}
                     onChange={e => setInput(e.currentTarget.value)}
                     value={input}
                     placeholder={currentQuestions.question}
                     name="name"
                     />
            <Button
                disabled={isButtonDisabled}
                variant="solid-light"
                size="sm"
                type={isLastStep ? "submit" : "button"}
                onClick={!isLastStep ? () => onNext({ [currentQuestions.key]: input }) : undefined}
                    >
                {isLastStep ? "Get Your Plan" : "Next"}
            </Button>
            {isLastStep && <p className="text-xs sm:text-sm text-white/50">
                                *By clicking <strong>Get Your Plan</strong>, you agree to our <Link className="underline" href="/legal/privacy">Privacy Policy</Link>.
                                Your information will remain confidential and used only for the purpose of this request.
                            </p>
            }
        </div>
    )
   }
}
