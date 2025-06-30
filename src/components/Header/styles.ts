import clsx from "clsx";

export const desktopStyles = clsx(
    "flex",
    "gap-10",
    "text-white",
    "max-sm:hidden"
)

export const burgerMenuStyles = clsx(
    "hidden",
    "max-sm:flex"
)

export const mobileStyles = clsx(
    "w-full",
    "p-4",
    "absolute",
    "top-[80px]",
    "left-0",
    "max-sm:flex",
    "flex-col",
    "gap-4",
    "text-center",
    "text-white",
    "transition-all"
)