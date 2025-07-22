import { FormType } from "@/types/form"

const form = new Map<string, FormType[]>([
    ['mainInfo', [
        {
            question: "How can I help you?",
            options: ["Healthy Habits", "Build Muscle"],
            type: "button"
        },
        {
            question: "How do you identify?",
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
            question: "Myself or my assistant will be reaching out to you via Instagram to discuss this program. Is it downloaded?",
            options: ["Yes", "No"],
            type: "button"
        },
    ]],
    ['contactInfo', [
        {
            question: "Your name",
            type: "input",
         },
         {
             question: "Email",
             type: "input",
             subtype: "email"

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