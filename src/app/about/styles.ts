import clsx from "clsx";

export const aboutContainerStyles = clsx(
    "pt-[120px] pb-[40px]"
)

export const aboutItemsWrapperStyles = clsx(
    "mx-8",
    "flex justify-center gap-10",

    "max-[1200px]:flex-col",
    "max-[1200px]:items-center"
)

export const aboutItemsImageStyles = clsx(
    "w-130",
    "rounded-xl",

    "max-[1200px]:w-full"
)

export const aboutItemsTextWrapperStyles = clsx(
    "w-150",
    "flex flex-col gap-5",

    "max-[1200px]:w-full"
)

export const aboutItemsTextDescriptionStyles = clsx(
    "italic",
    "font-bold"
)

export const aboutItemsButtonsWrapper = clsx(
    "flex gap-5",
    "max-sm:flex-col"
)

export const aboutButtonStyles = clsx(
    "py-3 px-5",
    "text-center",
    "text-white",
    "bg-black",
    "rounded-xl",
    "duration-300",
    "ease-out",

    "hover:opacity-90",

    "max-sm:w-full"
)