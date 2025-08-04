import clsx from "clsx";

export const fqasContainerStyles = clsx(
    "px-5 py-10",
    "flex flex-col items-center"
)

export const fqasTitleStyles = clsx(
    "text-6xl",
    "text-center"
)

export const fqasItemsContainerStyles = clsx(
    "w-[70%]",
    "pt-10",
    "flex flex-col gap-5",

    "max-[1025px]:w-[90%]",
    "max-sm:w-full"
)

export const fqasItemsWrapperStyles = clsx(
   "p-5",
    "bg-[#F0F0F0]",
    "rounded-xl"
)

export const fqasItemsTitleWrapperStyles = clsx(
    "flex justify-between items-center gap-2",
    "cursor-pointer"
)

export const fqasItemsTitleStyles = clsx(
    "text-2xl",
    "font-extrabold",

    "max-sm:text-xl"
)

export const fqasItemsTitleArrowStyles = clsx(
    "min-w-10",
    "transition-all",
    "delay-100 duration-400 ease-in-out"
)