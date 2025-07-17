import clsx from "clsx";

export const mainTitleStyles = clsx(
    "text-5xl",
    "text-[#1F1F1F]",
    "text-center",
)

export const itemsContainerStyles = clsx(
    "py-10",
    "flex justify-center items-center gap-10",

    "max-[769px]:flex-col"
)

export const itemsWrapperStyles = clsx(
    "w-[30%]",
    "flex flex-col justify-between items-center",
    "text-center",

    "min-[1025px]:max-w-[22%]",
    "max-[769px]:w-[70%]",
    "max-sm:w-full"
)

export const itemStepStyles = clsx(
    "w-10 h-10",
    "flex justify-center items-center",
    "text-white",
    "font-bold",
    "bg-[#131313]",
    "rounded-full",
)

export const itemTitleStyles = clsx(
    "pt-3",
    "text-xl",
    "font-bold",
)

export const itemDescriptionStyles = clsx(
    "pt-2",
)

export const itemImageStyles = clsx(
    "pt-4",
)