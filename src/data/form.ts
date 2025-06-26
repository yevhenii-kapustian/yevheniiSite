import { FormType } from "@/types/form"

const form = new Map<string, FormType[]>([
    ['mainInfo', [
        {
            question: "How can I help you",
            options: ["Healthy Habits", "Build Muscle"],
            type: "button"
        },
        {
            question: "How do you identify",
            options: ["Male", "Female"],
            type: "button"
        },
        {
            question: "I am",
            options: ["Under 18", "18+"],
            type: "button"
        },
        {
            question: "What is your motivation to start now?",
            type: "input"
        },
        {
            question: "Why have you chosen me to be your coach?",
            type: "input"
        },
        {
            question: "Myself or my assistant will be reaching out to you via Instagram to discuss this program. Is it downloaded?",
            options: ["Yes", "No"],
            type: "button"
        },
        {
            question: "Are you serious about committing to my program and what has stopped you from achieving your goals so far?",
            type: "input"
        },
        {
            question: "What are you struggling with at the moment?",
            type: "input"
        },
        {
            question: "What do you do for a living? (Your current occupation)",
            type: "input"
        }
    ]],
    ['contactInfo', [
        {
            question: "Your name",
            type: "input"
         },
         {
             question: "Email",
             type: "input"
         },
         {
             question: "Your Instagram handle",
             type: "input"
         },
    ]]
])

const mainInfo = form.get("mainInfo")
const contactInfo = form.get("contactInfo")
export const formMerged = [...(mainInfo || []), ...(contactInfo || [])]