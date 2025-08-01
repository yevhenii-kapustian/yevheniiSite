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
             "flex flex-col ",
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

        descriptionProductStyles: clsx(
            ""
        ),

        subDescriptionProductStyles: clsx(
            ""
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

            "max-lg:grid-cols-[repeat(2,1fr)]",
        ),
         
        productsWrapperStyles: clsx(

        ),

        imageProductStyles: clsx(

        ),
         
        textItemsWrapperStyles: clsx(

        ),

        nameProductStyles: clsx(

        ),

        descriptionProductStyles: clsx(
            ""
        ),

        subDescriptionProductStyles: clsx(
            ""
        ),
         
        buttonStyles: clsx(
            "bg-black"     
        )
    },

    product: {
        productsContainerStyles: clsx(
        ),
         
        productsWrapperStyles: clsx(
            "flex justify-center gap-10",

            "max-[860]:flex-col"
        ),

        imageProductStyles: clsx(
            "w-[35%]",
            "rounded-xl",
            "object-contain",

            "max-[1150]:w-[50%]",
            "max-[860]:w-full"
        ),
         
        textItemsWrapperStyles: clsx(
            "w-[35%]",

            "max-[1150]:w-[50%]",
            "max-[860]:w-full"
        ),

        nameProductStyles: clsx(
            "pt-5",
            "text-3xl",
            "font-extrabold"
        ),

        descriptionProductStyles: clsx(
            ""
        ),

        subDescriptionProductStyles: clsx(
            "pl-5",
            "whitespace-pre-line"
        ),
         
        buttonStyles: clsx(
            "mt-8",
            "p-3",
            "w-full",
            "inline-block",
            "bg-black",
            "text-white",
            "text-center",
            "rounded"
        )
    }
}
