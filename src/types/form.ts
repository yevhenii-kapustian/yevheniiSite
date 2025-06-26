type ButtonType = {
    question: string,
    type: string,
    options: string[],
}

type InputType = {
    question: string,
    type: string,
}

export type FormType = ButtonType | InputType 
 