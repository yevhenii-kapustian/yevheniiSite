import clsx from "clsx";

export const desktopStyles = clsx(
    "flex",
    "gap-10",
    "text-white",
    "max-sm:hidden"
)

export const burgerMenuStyles = clsx(
    "hidden",
    "max-sm:block"
)

export const mobileStyles = clsx(
    "hidden",
    "flex-col",
    "gap-4",
    "text-center",
    "text-white",
    "max-sm:flex"
)