import clsx from "clsx";

export const aboutContainerStyles = clsx(
    "pt-[120px] pb-[40px]"
)

export const aboutItemsWrapperStyles = clsx(
    "mx-8",
    "flex justify-center gap-10",

    "max-[769px]:flex-col"
)

export const aboutItemsImageStyles = clsx(
    "max-w-130",
    "w-[50%]",
    "rounded-xl",
    "object-contain",

    "max-[769px]:max-w-full",
    "max-[769px]:w-full"
)

export const aboutItemsTextWrapperStyles = clsx(
    "w-150",
    "flex flex-col gap-5",

    "max-[769px]:w-full"
)

export const aboutItemsTextDescriptionStyles = clsx(
    "italic",
    "font-bold"
)

export const aboutItemsButtonsWrapper = clsx(
    "flex gap-5",

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