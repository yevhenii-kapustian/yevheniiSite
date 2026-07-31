type ButtonType = {
    key: string
    question: string
    type: "button"
    options: string[]
}

type InputType = {
    key: string
    question: string
    type: "input"
    subtype?: string
}

type VisualType = {
    key: "bodyStats"
    type: "visual"
}

type MultiSelectType = {
    key: string
    question: string
    type: "multiselect"
    options: string[]
}

export type FormType = ButtonType | InputType | VisualType | MultiSelectType

export type QuizAnswers = Partial<{
    gender: string
    age: string
    height: string
    weight: string
    goal: string
    activityLevel: string
    experience: string
    daysPerWeek: string
    equipment: string
    productChoice: string
    name: string
    email: string
}>
