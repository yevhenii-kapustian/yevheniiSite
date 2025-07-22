import clsx from "clsx"

export const formContainerStyles = clsx(
    "h-100", 
    "px-10",
    "relative",
    "flex flex-col justify-center items-center gap-5",
    "text-[#1A1A1A]",
    "bg-[#ffdc26]",
    "overflow-hiden",
)

export const formTitleStyles = clsx( 
    "text-4xl",
    "font-extrabold",
    "text-center",
)

export const stepButton = clsx(
    "py-2 px-4",
    "w-fit",
    "border rounded-xl",
    "cursor-pointer",
)

export const optionButton = clsx(
    "py-3 px-5",
    "cursor-pointer",
    "border-0 rounded-xl",
    "bg-[#1A1A1A]",
    "text-white text-[14px]",
    "duration-100 ease-in",

    "hover:bg-[#3B3B3B]"
)

export const inputTextAreaStyles = clsx(
    "p-2",
    "border-b",
    "resize-none",
    "outline-none"
    ,
    "max-sm:placeholder:text-[14px]"
)