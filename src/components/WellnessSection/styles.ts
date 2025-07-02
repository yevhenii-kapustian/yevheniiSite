import { clsx } from "clsx";

export const wellnessContainerStyles = clsx(
    "py-10 px-20",
    "flex items-center justify-evenly",

    "max-sm:flex-col gap-5",
    "max-[1201]:px-5"
)

export const wellnessTextWrapperStyles = clsx(
    "w-[25%]",
    "flex flex-col gap-3",

    "max-[1201]:w-[40%]",
    "max-sm:w-[100%]"
)

export const wellnessButtonStyles = clsx(
    "size-fit",
    "font-semibold",
    "uppercase",
    "underline underline-offset-6"
)

export const productContainer = clsx(
    "flex gap-10",
    "w-[75%]",
    "max-w-[1000px]",

    "max-[1201]:w-[60%]",
    "max-sm:w-[100%]"

)