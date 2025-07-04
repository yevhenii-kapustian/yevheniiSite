import clsx from "clsx";

export const productsContainerStyles = clsx(
    "p-5",
    "flex gap-5",
    "overflow-x-scroll",
)

export const productsWrapperStyles = clsx(
    "flex flex-col",
    "shadow-[0px_0px_18px_-6px_#000000]",
    "rounded-xl",
    "min-w-[250px]"
)

export const textItemsWrapperStyles = clsx(
    "h-full",
    "p-5",
    "flex flex-col justify-between gap-2"
)

export const buttonStyles = clsx(
    "size-fit",
    "font-semibold",
    "underline underline-offset-6"    
)