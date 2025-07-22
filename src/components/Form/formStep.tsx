import { FormType } from "@/types/form";
import React, {SetStateAction} from "react";
import { stepButton,
         optionButton,
         inputTextAreaStyles } from "./styles";

type FormStepType = {
    currentQuestions: FormType,
    input: string,
    isLastStep: boolean,
    setInput: React.Dispatch<SetStateAction<string>>
    onNext: (value: string) => void,
}

export default function FormStep ({currentQuestions, onNext, setInput, input, isLastStep}:FormStepType) {
   if (currentQuestions.type === "button" && 'options' in currentQuestions) {
    return(
        <div className="flex flex-col justify-center gap-3">
            <h4 className="text-center text-xl font-extrabold">{currentQuestions.question}</h4>
            <div className="flex justify-center gap-3">
                {currentQuestions.options.map(item => <button className={optionButton} onClick={() => onNext(`${item}`)} key={item}>{item}</button> )}
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
            <textarea className={inputTextAreaStyles}
                     rows={1} 
                     onChange={e => setInput(e.currentTarget.value)} 
                     value={input} 
                     placeholder={currentQuestions.question} 
                     name="name"
                     />
            <button disabled={isButtonDisabled} 
                    className={`${stepButton} disabled:opacity-50 disabled:cursor-default`} 
                    type={isLastStep ? "submit" : "button"} 
                    onClick={!isLastStep ? () => onNext(input) : undefined}
                    >
                {isLastStep ? "Submit" : "Next"}
            </button>
            {isLastStep && <p className="text-[14px] opacity-80">
                                *By clicking <strong>Submit</strong>, you agree to our <a className="underline" href="/legal/privacy">Privacy Policy</a>.
                                Your information will remain confidential and used only for the purpose of this request.
                            </p>
            }
        </div>
    )
   }
}
