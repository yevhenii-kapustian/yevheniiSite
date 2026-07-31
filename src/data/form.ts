import { FormType } from "@/types/form"

export const formSteps: FormType[] = [
    {
        key: "bodyStats",
        type: "visual",
    },
    {
        key: "activityLevel",
        question: "What's your daily activity like outside of training?",
        options: ["Mostly sitting", "On my feet a lot", "Physically demanding job"],
        type: "button",
    },
    {
        key: "experience",
        question: "What's your training experience?",
        options: ["New to training", "Some experience", "Advanced"],
        type: "button",
    },
    {
        key: "daysPerWeek",
        question: "How many days per week can you train?",
        options: ["2-3", "4", "5+"],
        type: "button",
    },
    {
        key: "equipment",
        question: "What do you have access to?",
        options: ["Full gym", "Home basics", "Bodyweight only"],
        type: "button",
    },
    {
        key: "productChoice",
        question: "Which plan do you want?",
        options: ["Nutrition Plan — $25/mo", "Training Plan — $25/mo"],
        type: "multiselect",
    },
    {
        key: "name",
        question: "Your name",
        type: "input",
    },
    {
        key: "email",
        question: "Email",
        type: "input",
        subtype: "email",
    },
]

export const PRODUCT_ID_BY_CHOICE: Record<string, string> = {
    "Nutrition Plan — $25/mo": "6",
    "Training Plan — $25/mo": "7",
}
