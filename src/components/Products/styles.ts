import clsx from "clsx";

export const variantsStyles = {

    home: {
        productsContainerStyles: clsx(
             "flex gap-5",
        ),
         
        productsWrapperStyles: clsx(
             "flex flex-col",
             "rounded-xl",
             "min-w-[250px]",
             
             "max-sm:min-w-1/2"
        ),

        imageProductStyles: clsx(

        ),
         
        textItemsWrapperStyles: clsx(
            "pt-3",
             "flex flex-col justify-between"
        ),

        nameProductStyles: clsx(
            "max-sm:text-sm"
        ),
         
        buttonStyles: clsx(
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

        nameProductStyles: clsx(

        ),
         
        buttonStyles:  clsx(
            "bg-black"     
        )
    }

}
