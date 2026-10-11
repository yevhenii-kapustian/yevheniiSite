'use client'
import useFormLogic from "./useFormLogic";
import FormStep from "./formStep";
import { useEffect, useRef } from "react";
import gsap from "gsap"
import Reveal from "@/components/animation/Reveal";

const Form = () => {
    const { step,
            currentQuestions,
            input,
            loading,
            error,
            formSteps,
            handleNext,
            setInput,
            handleSubmit,
                        } = useFormLogic()

    const progressRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement | HTMLFormElement>(null)

    const progress = ((step + 1) / formSteps.length) * 100

    useEffect(() => {
        gsap.to(progressRef.current, { width: `${progress}%`, duration: 0.4, ease: "power3.out" })
    }, [progress])

    useEffect(() => {
        gsap.fromTo(stageRef.current, { autoAlpha: 0, x: loading ? 0 : 12, y: loading ? 8 : 0 }, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
        })
    }, [loading, step])

    return(
        <Reveal
                as="section"
                className="min-h-[calc(100dvh-90px)] sm:min-h-[calc(100dvh-100px)] px-5 sm:px-10 lg:px-20 py-16 relative flex items-center text-white"
        >
            <div className="absolute inset-x-0 -top-[90px] h-[calc(100%+90px)] sm:-top-[100px] sm:h-[calc(100%+100px)] -z-10 overflow-hidden bg-surface-strong">
                <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]"/>
                <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"/>
                <div className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-white/5 blur-3xl"/>
                <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-white/[0.06] blur-3xl"/>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-surface-strong))]"/>
            </div>

            <div className="w-full">
                <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
                    {!loading && (
                        <div className="flex items-center gap-3 pb-8">
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                                <div
                                    ref={progressRef}
                                    className="h-full rounded-full bg-white"
                                />
                            </div>
                            <span className="shrink-0 text-xs text-white/40">{step + 1}/{formSteps.length}</span>
                        </div>
                    )}

                    {loading ? (
                        <div ref={stageRef as React.RefObject<HTMLDivElement>} key="loading" className="flex flex-col items-center gap-3 py-10 text-center">
                            <p className="text-lg font-semibold">Taking you to checkout…</p>
                            <p className="text-sm text-white/60">Your personalized plan is waiting on the other side.</p>
                        </div>
                    ) : (
                        <form ref={stageRef as React.RefObject<HTMLFormElement>} key={step} onSubmit={handleSubmit}>
                            <FormStep
                                currentQuestions={currentQuestions}
                                isLastStep={step === formSteps.length - 1}
                                onNext={handleNext}
                                setInput={setInput}
                                input={input}
                            />
                            {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}
                        </form>
                    )}
                </div>
            </div>
        </Reveal>
    )
}

export default Form
