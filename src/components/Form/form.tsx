'use client'
import useFormLogic from "./useFormLogic";
import FormStep from "./formStep";
import { babes } from "@/app/fonts"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef } from "react";
import LoadingIcons from 'react-loading-icons'
import { CheckCircle } from "@phosphor-icons/react"

const perks = [
    "Takes about 2 minutes",
    "Personalized to your goals, not a template",
    "I reply myself on Instagram within 24h",
]

const Form = () => {
    const { step,
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
                        } = useFormLogic()

    const ref = useRef(null)
    const isInView = useInView(ref, {once: true})

    const progress = ((step + 1) / formMerged.length) * 100

    return(
        <motion.section
                ref={ref}
                initial={{y: 32, opacity: 0}}
                animate={isInView ? {y: 0, opacity: 1} : {}}
                transition={{duration: 0.6, ease: "easeOut"}}
                className="min-h-[calc(100dvh-90px)] sm:min-h-[calc(100dvh-100px)] px-5 sm:px-10 lg:px-20 py-16 relative flex items-center text-white"
        >
            <div className="absolute inset-x-0 -top-[90px] h-[calc(100%+90px)] sm:-top-[100px] sm:h-[calc(100%+100px)] -z-10 overflow-hidden bg-surface-strong">
                <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"/>
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"/>
                <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl"/>
                <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl"/>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-surface-strong))]"/>
            </div>

            <div className="mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-2 lg:items-center">
                <div className="flex flex-col items-start gap-4 text-left">
                    <span className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                        1:1 with a real coach
                    </span>
                    <h1 className={`${babes.className} text-5xl sm:text-6xl leading-[0.95]`}>Build the Body You Deserve</h1>
                    <p className="max-w-md text-sm sm:text-base text-white/60">
                        Answer a few quick questions about your goals and lifestyle — I&apos;ll personally review your answers and reach out on Instagram to talk through the right plan for you.
                    </p>
                    <ul className="flex flex-col gap-3 pt-2">
                        {perks.map(perk => (
                            <li key={perk} className="flex items-center gap-2 text-sm text-white/70">
                                <CheckCircle size={18} weight="fill" className="shrink-0 text-white/40" />
                                {perk}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
                    {!submitted && (
                        <div className="flex items-center gap-3 pb-8">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    className="h-full rounded-full bg-white"
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                            </div>
                            <span className="shrink-0 text-xs text-white/40">{step + 1}/{formMerged.length}</span>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="submitted"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-3 py-10 text-center"
                            >
                                <CheckCircle size={40} weight="fill" />
                                <p className="text-lg font-semibold">Thanks — you&apos;re all set!</p>
                                <p className="text-sm text-white/60">Check your Instagram DMs within 24 hours.</p>
                                <p className="pt-2 text-xs text-white/40">Taking you to our programs…</p>
                            </motion.div>
                        ) : loading ? (
                            <div className="flex justify-center py-10">
                                <LoadingIcons.Oval />
                            </div>
                        ) : (
                            <motion.form
                                key={step}
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                onSubmit={handleSubmit}
                            >
                                <input
                                    type="text"
                                    name="website"
                                    value={honeypot}
                                    onChange={e => setHoneypot(e.currentTarget.value)}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    aria-hidden="true"
                                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                                />
                                <FormStep
                                    currentQuestions={currentQuestions}
                                    isLastStep={step === formMerged.length - 1}
                                    onNext={handleNext}
                                    setInput={setInput}
                                    input={input}
                                />
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    )
}

export default Form
