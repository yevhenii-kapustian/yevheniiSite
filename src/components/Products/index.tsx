'use client'

import Image from "next/image";
import { products } from "@/data/products"
import { ProductsType } from "@/types/products";
import Link from "next/link";
import { fromattedCurrancy } from "@/utils/currency";
import { useRouter } from "next/navigation";
import slugify from 'slugify'
import { CaretDoubleLeft, CaretDoubleRight } from "@phosphor-icons/react";
import { useProducts } from "@/context/ProductsContext";

type ProductsPropsType = {
    showName?: boolean,
    showDescription?: boolean,
    showPrice?: boolean,
    showBuy?: boolean,
    showPath?: boolean,
    showArrows?: boolean,
    product?: ProductsType[],
    variants?: "home" | "programs" | "product"
}

const variantsStyles = {
    home: {
        productsContainerStyles: "flex gap-5 overflow-x-auto snap-x snap-mandatory",
        productsWrapperStyles: "flex flex-col rounded-2xl w-1/2 snap-center sm:w-auto sm:min-w-[250px]",
        imageProductStyles: "rounded-2xl",
        textItemsWrapperStyles: "pt-3 flex flex-col justify-between",
        nameProductStyles: "text-sm sm:text-base font-semibold",
        subDescriptionProductStyles: "text-sm sm:text-base",
        buttonStyles: "size-fit font-semibold text-sm sm:text-base underline underline-offset-6"
    },

    programs: {
        productsContainerStyles: "grid gap-5 grid-cols-2 lg:grid-cols-4",
        productsWrapperStyles: "overflow-hidden rounded-2xl border border-black/5 bg-white transition-shadow duration-200 hover:shadow-lg",
        imageProductStyles: "w-full",
        textItemsWrapperStyles: "p-4",
        nameProductStyles: "text-sm sm:text-base font-semibold",
        subDescriptionProductStyles: "text-sm sm:text-base",
        buttonStyles: "rounded-full bg-black text-white text-sm sm:text-base"
    },

    product: {
        productsContainerStyles: "",
        productsWrapperStyles: "flex flex-col md:flex-row justify-center gap-10",
        imageProductStyles: "w-full md:w-[50%] lg:w-[35%] rounded-3xl object-contain",
        textItemsWrapperStyles: "w-full md:w-[50%] lg:w-[35%]",
        nameProductStyles: "pt-5 text-xl sm:text-2xl font-bold",
        subDescriptionProductStyles: "pl-5 text-sm sm:text-base whitespace-pre-line",
        buttonStyles: "mt-8 p-3.5 w-full inline-block rounded-full bg-black text-white text-center text-sm sm:text-base transition-colors duration-200 hover:bg-ink-strong"
    }
}

const Products = ({showName = true,
                   showDescription = true,
                   showPrice = true,
                   showBuy = true,
                   showPath = false,
                   showArrows = false,
                   product: customProduct,
                   variants="home"}: ProductsPropsType) => {

    const allProducts = products.get('plans');
    const productsToShow = customProduct ?? allProducts;
    const styles = variantsStyles[variants]
    const router = useRouter()

    const { containerRef, isAtStart, isAtEnd, handleScrollLeft, handleScrollRight } = useProducts()

    return(
        <>
        {showArrows && <CaretDoubleLeft className={`mb-18 min-w-[20px] ${isAtStart ? "opacity-50 cursor-default" : "opacity-100 cursor-pointer"}`}
                                        onClick={handleScrollLeft} size={150}/>}
        <ul ref={containerRef} className={`${styles.productsContainerStyles} scrollbar-hide`}>
            {productsToShow?.map((item:ProductsType, index:number) => {
                const learnMoreLink = slugify(item.name, {lower: true, strict: true})
                return(
                    <li onClick={variants !== "product" ? () => router.push(`/programs/${learnMoreLink}`) : undefined}
                        className={`${styles.productsWrapperStyles} ${variants !== "product" ? "cursor-pointer" : undefined}`}
                        key={index}
                    >
                        <Image className={styles.imageProductStyles} src={item.image} alt={item.name} width={1000} height={1000} priority/>
                        <div className={styles.textItemsWrapperStyles}>
                            {showPath && (
                                            <p className="text-xs">
                                                <Link href="/">Home {'>'} </Link>
                                                <Link href="/programs">Programs {'>'} </Link>
                                                <Link href={`/programs/${learnMoreLink}`}>{item.name}</Link>
                                            </p>
                            )}
                            {showName && <h4 className={styles.nameProductStyles}>{item.name}</h4> }
                            {showPrice && <p className="text-sm sm:text-base">{fromattedCurrancy(item.price)}</p> }
                            {showDescription && (
                                <div className="mt-3 pt-3 border-t border-t-[rgba(0,0,0,0.2)]">
                                    <h5 className="text-sm sm:text-base font-bold uppercase">What's Inside:</h5>
                                    <p className={styles.subDescriptionProductStyles}>{item.description}</p>
                                </div>
                            )}
                            {showBuy && <Link target="_blank" href={item.buyProduct} className={styles.buttonStyles}>Buy Now</Link> }
                        </div>
                    </li>
                   )
                })}
        </ul>
        {showArrows && <CaretDoubleRight className={`mb-18 min-w-[20px] ${isAtEnd ? "opacity-50 cursor-default" : "opacity-100 cursor-pointer"}`}
                                            onClick={handleScrollRight} size={150}/>}
        </>
    )
}

export default Products
