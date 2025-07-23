import clsx from "clsx";

export const transformContainerStyles = clsx(
    "p-10",
    "text-[#1A1A1A]"
)

export const transformTitleStyles = clsx(
    "text-5xl",
    "text-center"
)

export const transformSubtitleStyles = clsx(
    "text-center"
)

export const transformItemsContainerStyles = clsx(
    "pt-5",
    "relative",
    "flex justify-center items-center gap-10",

    "max-sm:flex-col"
)

export const transformItemImageStyles = clsx(
    "w-[50%]",
    "max-w-120",
    "rounded-xl",

    "max-sm:w-full"
)

export const transformItemTextContainer = clsx(
    "w-[40%]",

    "max-sm:w-full"
)

export const transformItemTextTitle = clsx(
    "text-xl",
    "whitespace-pre-line",
    "italic",

    "max-sm:text-[16px]"
)

export const transformItemTextSubtitle = clsx(
    "pt-5",
    "text-end",
    "italic"
)