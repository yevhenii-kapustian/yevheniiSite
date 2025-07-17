import clsx from "clsx";

export const variantsStyles = {

    home: {
        productsContainerStyles: clsx(
             "flex gap-5",
             
             "overflow-x-auto",
             "snap-x",
             "snap-mandatory"
        ),
         
        productsWrapperStyles: clsx(
             "flex flex-col justify-center",
             "rounded-xl",
             "min-w-[250px]",
             
             "max-sm:min-w-1/2",
             "max-sm:w-1/2 snap-center"
        ),

        imageProductStyles: clsx(
            "rounded-xl"
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
            "grid gap-5",
            "grid-cols-[repeat(4,1fr)]",

            "max-lg:grid-cols-[repeat(3,1fr)]",
            "max-sm:grid-cols-[repeat(2,1fr)]",  
        ),
         
        productsWrapperStyles: clsx(

        ),

        imageProductStyles: clsx(

        ),
         
        textItemsWrapperStyles: clsx(

        ),

        nameProductStyles: clsx(

        ),
         
        buttonStyles:  clsx(
            "bg-black"     
        )
    }

}
