import clsx from "clsx";

export const cookieContainer = clsx(
    "w-full",
    "p-6",
    "fixed",
    "flex justify-evenly items-center gap-5",
    "bg-black",
    "text-white text-[14px]",

    "max-sm:flex-col",
)

export const cookieWrapperButtons = clsx(
    "flex gap-5",
)

export const cookieButton = clsx(
    "px-3 py-2",
    "font-bold",
    "rounded",
    "cursor-pointer",
)