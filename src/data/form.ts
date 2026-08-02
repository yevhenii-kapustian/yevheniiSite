import { FormType } from "@/types/form"
export { BUNDLE_PRODUCT_ID } from "@/data/products"

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
