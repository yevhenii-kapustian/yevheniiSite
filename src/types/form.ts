type ButtonType = {
    question: string,
    type: string,
    options: string[],
    subtype?: string
}

type InputType = {
    question: string,
    type: string,
    subtype?: string
}

export type FormType = ButtonType | InputType 
 