import clsx from "clsx";

export const mainSectionStyles = clsx(
    "relative",
    "w-full",
    "h-180",
)

export const imageStyles = clsx(
    "w-full h-full",
    "object-cover"
)

export const bgGradient = clsx(
    "absolute inset-0",
    "bg-[linear-gradient(90deg,rgba(0,0,0,1)_10%,rgba(99,0,8,0)_70%)]",
)

export const textMainStyles = clsx(
    "pt-10",
    "w-full h-full",
    "max-w-[45%]",
    "relative left-[10vw]",
    "flex flex-col justify-center items-start gap-5",

    "max-[1025px]:max-w-[55%]",
    "max-[821px]:max-w-[60%]",
    "max-sm:max-w-[100%] max-sm:left-0 max-sm:px-5"
)