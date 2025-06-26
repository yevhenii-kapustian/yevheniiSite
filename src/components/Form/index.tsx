'use client'

import { useState } from "react";
import { formMerged } from '../../data/form'
import { FormType } from "@/types/form";

const Form = () => {
    const [step, setStep] = useState<number>(0)
    const [answers, setAnswers] = useState<string[]>([])
    const [input, setInput] = useState<string>('')

    const questions:FormType = formMerged[step];

    const handleNext = (value:string) => {
        
        if (questions.type === "button") {
            setAnswers(prev => [...prev, value])
            setStep(prev => prev + 1);
        }
        
        if (questions.type === "input") {
            if (answers.includes(value)) return
            if (input.trim() === '') return
            setAnswers([...answers, input])
            setInput('')
            setStep(prev => prev + 1);
        }
    }

    console.log(input);
    console.log(answers);
    
    
    return(
        <section>
            {step < formMerged.length ? (
                <div>
                   {questions.type === "button" && 'options' in questions && (
                    <div>
                        {questions.options.map(item => <button onClick={() => handleNext(`${item}`)} key={item}>{item}</button> )}
                    </div>
                   )}

                   {questions.type === "input" && (
                    <div>
                        <textarea onChange={e => setInput(e.currentTarget.value)} value={input} placeholder={questions.question} name="name" id="#"></textarea>
                        <button onClick={() => handleNext(input)}>Next question</button>
                    </div>
                   )}
                </div>




            ): (
                <div>
                    <h3>The form was successfully submitted </h3>
                </div>
            )}
        </section>
    )
}

export default Form