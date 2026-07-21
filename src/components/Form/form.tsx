'use client'
import useFormLogic from "./useFormLogic";
import FormStep from "./formStep";
import { motion, useInView } from "framer-motion"
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
                initial={{y: 32, opacity: 0}}
                animate={isInView ? {y: 0, opacity: 1} : {}}
                transition={{duration: 0.6, ease: "easeOut"}}
                id="formCoaching"
                className="min-h-100 px-5 sm:px-10 py-16 relative flex flex-col justify-center items-center gap-6 text-white bg-surface-strong"
        >
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold">Build the Body You Deserve</h2>
                <p className="pt-2 text-sm sm:text-base text-white/60">Leave your answers and we'll get back to you on Instagram within 24 hours.</p>
            </div>
             {submitted ? (
                        <motion.div>
                            <p>Form has been submitted</p>
                        </motion.div>
                    ) : loading ? (
                        <LoadingIcons.Oval />
                    ) : (
                    <motion.form className="w-full sm:w-140" onSubmit={handleSubmit}>
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
