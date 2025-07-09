import clsx from "clsx";

export const variantsStyles = {

    home: {
        productsContainerStyles: clsx(
             "p-5",
             "flex gap-5",
             "overflow-x-scroll",
         ),
         
        productsWrapperStyles: clsx(
             "flex flex-col",
             "shadow-[0px_0px_18px_-6px_#000000]",
             "rounded-xl",
             "min-w-[250px]"
        ),

        imageProductStyles: clsx(
            "rounded-xl",
        ),
         
        textItemsWrapperStyles: clsx(
             "h-full",
             "p-5",
             "flex flex-col justify-between gap-2"
        ),
         
        buttonStyles:  clsx(
             "size-fit",
             "font-semibold",
             "underline underline-offset-6"    
        )
    },

    programs: {
        productsContainerStyles: clsx(
            "bg-black"
        ),
         
        productsWrapperStyles: clsx(
            "bg-black"
        ),

        imageProductStyles: clsx(
            "rounded-xl",
        ),
         
        textItemsWrapperStyles: clsx(
            "bg-black"
        ),
         
        buttonStyles:  clsx(
            "bg-black"     
        )
    }

}
