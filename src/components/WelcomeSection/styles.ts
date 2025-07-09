import clsx from "clsx";

export const welcomeContainerStyles = clsx(
    "relative",
    "w-full",
    "h-180",

    "max-sm:h-[100dvh]"
)

export const imageStyles = clsx(
    "w-full h-full",
    "object-cover",
    "object-[0_25%]",

    "max-[1025px]:object-[70%_25%] max-sm:object-[75%_25%]"
)

export const bgGradient = clsx(
    "absolute inset-0",
    "bg-[linear-gradient(90deg,rgba(0,0,0,1)_10%,rgba(99,0,8,0)_70%)]",
)

export const textContainerStyles = clsx(
    "w-full h-full",
    "max-w-[45%]",
    "relative left-[10vw]",
    "flex flex-col justify-center items-start gap-5",

    "max-sm:pt-10",
    "max-[1025px]:max-w-[55%]",
    "max-[821px]:max-w-[60%]",
    "max-sm:max-w-[100%] max-sm:left-0 max-sm:px-5",
    "max-sm:gap-[clamp(1rem,3vh,4rem)]"
)

export const titleStyles = clsx(
    "text-7xl",
    "font-extrabold",
    "text-white",
    "text-shadow-[0px_0px_12px_#00000070]",

    "max-[1025px]:text-6xl",
    "max-sm:text-[47px]",
)

export const descriptionStyles = clsx(
    "w-[70%]",
    "text-l",
    "text-white",
    "text-shadow-[0px_0px_12px_#00000070]",
    
    "max-[1200px]:w-full",
    "max-[1025px]:text-[14px]",
)

export const buttonStartStyles = clsx(
    "bg-white",
    "border-transparent",
    "hover:text-white",
    "hover:bg-transparent",
    "hover:border-white",
)