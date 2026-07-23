'use client'

import Image from "next/image";
import { products } from "@/data/products"
import { ProductsType } from "@/types/products";
import Link from "next/link";
import { fromattedCurrancy } from "@/utils/currency";
import { useRouter } from "next/navigation";
import slugify from 'slugify'
import { CaretDoubleLeft, CaretDoubleRight, CheckCircle } from "@phosphor-icons/react";
import { useProducts } from "@/context/ProductsContext";
import { babes } from "@/app/fonts";
import Button from "@/components/Button";

type ProductsPropsType = {
    showName?: boolean,
    showDescription?: boolean,
    showPrice?: boolean,
    showBuy?: boolean,
    showPath?: boolean,
    showArrows?: boolean,
    product?: ProductsType[],
    variants?: "home" | "programs" | "product" | "related"
}

const variantsStyles = {
    home: {
        productsContainerStyles: "flex gap-5 overflow-x-auto snap-x snap-mandatory",
        productsWrapperStyles: "flex flex-col rounded-2xl w-1/2 min-w-0 shrink-0 snap-center sm:w-auto sm:min-w-[250px]",
        imageWrapperStyles: "relative aspect-square w-full overflow-hidden rounded-2xl",
        imageProductStyles: "object-cover",
        textItemsWrapperStyles: "pt-3 flex flex-col justify-between",
        nameProductStyles: "text-sm sm:text-base font-semibold",
        subDescriptionProductStyles: "text-sm sm:text-base",
    },

    related: {
        productsContainerStyles: "grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4",
        productsWrapperStyles: "group flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white transition-shadow duration-300 hover:shadow-md",
        imageWrapperStyles: "relative aspect-square w-full overflow-hidden",
        imageProductStyles: "object-cover transition-transform duration-300 group-hover:scale-105",
        textItemsWrapperStyles: "flex flex-1 flex-col gap-0.5 p-3",
        nameProductStyles: "text-xs sm:text-sm font-semibold text-ink-strong",
        subDescriptionProductStyles: "text-xs sm:text-sm",
    },

    programs: {
        productsContainerStyles: "grid gap-5 sm:gap-6 grid-cols-2 lg:grid-cols-5",
        productsWrapperStyles: "group overflow-hidden rounded-2xl border border-black/5 bg-white transition-shadow duration-300 hover:shadow-lg",
        imageWrapperStyles: "relative aspect-square w-full overflow-hidden",
        imageProductStyles: "object-cover transition-transform duration-300 group-hover:scale-105",
        textItemsWrapperStyles: "p-4",
        nameProductStyles: "text-sm sm:text-base font-semibold text-ink-strong",
        subDescriptionProductStyles: "text-sm sm:text-base",
    },

    product: {
        productsContainerStyles: "mx-auto max-w-5xl",
        productsWrapperStyles: "flex flex-col md:flex-row md:items-start justify-center gap-10 lg:gap-16",
        imageWrapperStyles: "relative aspect-square w-full overflow-hidden rounded-3xl border border-black/5 md:w-[52%]",
        imageProductStyles: "object-cover",
        textItemsWrapperStyles: "w-full pt-2 md:w-[48%]",
        nameProductStyles: "text-2xl sm:text-3xl leading-[0.95]",
        subDescriptionProductStyles: "text-sm sm:text-base whitespace-pre-line",
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
        {showArrows && <CaretDoubleLeft className={`hidden sm:block shrink-0 transition-opacity duration-150 ${isAtStart ? "opacity-30 cursor-default" : "opacity-70 hover:opacity-100 cursor-pointer"}`}
                                        onClick={handleScrollLeft} size={32}/>}
        <ul ref={containerRef} className={`${styles.productsContainerStyles} scrollbar-hide`}>
            {productsToShow?.map((item:ProductsType, index:number) => {
                const learnMoreLink = slugify(item.name, {lower: true, strict: true})
                return(
                    <li onClick={variants !== "product" ? () => router.push(`/programs/${learnMoreLink}`) : undefined}
                        className={`${styles.productsWrapperStyles} ${variants !== "product" ? "cursor-pointer" : undefined}`}
                        key={index}
                    >
                        <div className={styles.imageWrapperStyles}>
                            <Image className={styles.imageProductStyles} src={item.image} alt={item.name} fill priority/>
                        </div>
                        <div className={styles.textItemsWrapperStyles}>
                            {showPath && (
                                <p className="pb-4 text-xs text-ink-strong/50">
                                    <Link className="hover:text-ink-strong hover:underline" href="/">Home</Link>
                                    <span className="px-1.5">/</span>
                                    <Link className="hover:text-ink-strong hover:underline" href="/programs">Programs</Link>
                                    <span className="px-1.5">/</span>
                                    <span className="text-ink-strong/80">{item.name}</span>
                                </p>
                            )}
                            {showName && (
                                <h4 className={variants === "product" ? `${babes.className} ${styles.nameProductStyles}` : styles.nameProductStyles}>
                                    {item.name}
                                </h4>
                            )}
                            {showPrice && (
                                <p className={variants === "product"
                                    ? "pt-2 text-lg sm:text-xl font-semibold text-ink-strong"
                                    : variants === "related"
                                        ? "text-xs sm:text-sm font-medium text-ink-strong/60"
                                        : "text-sm sm:text-base font-medium text-ink-strong/60"}
                                >
                                    {fromattedCurrancy(item.price)}
                                </p>
                            )}
                            {showDescription && (
                                <div className="mt-3 pt-3 border-t border-t-[rgba(0,0,0,0.2)]">
                                    <h5 className="text-sm sm:text-base font-bold uppercase">What's Inside:</h5>
                                    {variants === "product" ? (
                                        <ul className="mt-3 flex flex-col gap-2.5">
                                            {item.description.split("\n").map(line => line.trim()).filter(Boolean).map((line, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-ink-strong/80">
                                                    <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-ink-strong/30" />
                                                    <span>{line.replace(/^•\s*/, "")}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className={styles.subDescriptionProductStyles}>{item.description}</p>
                                    )}
                                </div>
                            )}
                            {showBuy && (
                                <Button href={item.buyProduct} target="_blank" variant="solid" size="sm" fullWidth className="mt-8">
                                    Buy Now
                                </Button>
                            )}
                        </div>
                    </li>
                   )
                })}
        </ul>
        {showArrows && <CaretDoubleRight className={`hidden sm:block shrink-0 transition-opacity duration-150 ${isAtEnd ? "opacity-30 cursor-default" : "opacity-70 hover:opacity-100 cursor-pointer"}`}
                                            onClick={handleScrollRight} size={32}/>}
        </>
    )
}

export default Products
