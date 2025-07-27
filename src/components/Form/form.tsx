'use client'
import useFormLogic from "./useFormLogic";
import FormStep from "./formStep";
import { motion, useInView } from "framer-motion"
import { formContainerStyles,
        formTitleStyles
     } from "./styles";
import { useRef } from "react";
import LoadingIcons from 'react-loading-icons'

const Form = () => {
    const { step,
            currentQuestions,
            input,
            loading,
            submitted,
            formMerged,
            handleNext,
            setInput,
            handleSubmit
                        } = useFormLogic()

    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    return(
        <motion.section
                ref={ref} 
                initial={{y: -100, opacity: 0}}
                animate={isInView ? {y: 0, opacity: 1} : {}}
                transition={{duration: 0.5}}
                id="formCoaching" className={formContainerStyles}>
            <div>
                <h2 className={formTitleStyles}>Build the Body You Deserve</h2>
                <p className="text-center">Leave your answers and we'll get back to you on Instagram within 24 hours.</p>
            </div>
             {submitted ? (
                        <motion.div>
                            <p>Form has been submitted</p>
                        </motion.div>
                    ) : loading ? (
                        <LoadingIcons.Oval />
                    ) : (
                    <motion.form className="w-140 max-sm:w-full" onSubmit={handleSubmit}>
                        {step < formMerged.length && (
                                <FormStep currentQuestions={currentQuestions}
                                            isLastStep={step === formMerged.length - 1}
                                            onNext={handleNext} 
                                            setInput={setInput} 
                                            input={input}/>
                        )}
                    </motion.form>
                )}
        </motion.section>
    )
}

export default Form