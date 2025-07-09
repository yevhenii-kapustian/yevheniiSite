import clsx from "clsx";

export const headerMainStyles = clsx(
    "w-full",
    "fixed",
    "flex justify-around items-center",
    "z-10",
    "duration-300 ease-in-out",

    "max-sm:justify-between",
    "max-sm:px-5"
)

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