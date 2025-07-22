import clsx from "clsx";

export const statsContainerStyles = clsx(
    "py-15 px-5",
    "bg-[#090909]",
    "text-white",

    "max-[769px]:px-15",
    "max-sm:px-10"
)

export const statsTitleStyles = clsx(
    "text-5xl",
    "text-center"
)

export const statsItemsContainer = clsx(
    "pt-10",
    "flex justify-center gap-30",

    "max-sm:flex-col",
    "max-lg:gap-10"
)

export const statsItemsWrapper = clsx(
    "flex flex-col items-center gap-2"
)

export const statsItemsIconWrapper = clsx(
    "p-2",
    "rounded-full",
    "bg-[#464646]",
)

export const statsItemsNumber = clsx(
    "pt-3",
    "text-3xl",
    "font-extrabold",
)

export const statsItemsTitle = clsx(

)

export const statsItemsSubtitle = clsx(
    "font-bold"
)

export const statsDescriptionStyles = clsx(
    "pt-10",
    "text-center",
    "text-[14px]",

    "max-sm:text-[12px]"
)