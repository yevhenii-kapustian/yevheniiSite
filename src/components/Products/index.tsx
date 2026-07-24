'use client'

import Image from "next/image";
import { useState } from "react";
import { ProductsType } from "@/types/products";
import Link from "next/link";
import { fromattedCurrancy } from "@/utils/currency";
import { useRouter } from "next/navigation";
import slugify from 'slugify'
import { CaretDoubleLeft, CaretDoubleRight, CheckCircle } from "@phosphor-icons/react";
import { useProducts } from "@/context/ProductsContext";
import { useProductsData } from "@/hooks/useProductsData";
import { babes } from "@/app/fonts";
import Button from "@/components/Button";

const SKELETON_COUNT = 5

type ProductsPropsType = {
    showName?: boolean,
    showDescription?: boolean,
    showPrice?: boolean,
    showBuy?: boolean,
    showPath?: boolean,
    showArrows?: boolean,
    product?: ProductsType[],
    variants?: "home" | "product" | "related"
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

    const { products: fetchedProducts, loading } = useProductsData(!customProduct)
    const productsToShow = customProduct ?? fetchedProducts;
    const styles = variantsStyles[variants]
    const router = useRouter()

    const { containerRef, isAtStart, isAtEnd, handleScrollLeft, handleScrollRight } = useProducts()
    const [checkoutLoadingId, setCheckoutLoadingId] = useState<number | null>(null)
    const [agreedToTermsId, setAgreedToTermsId] = useState<number | null>(null)

    const handleBuyNow = async (e: React.MouseEvent, productId: number) => {
        e.stopPropagation()
        setCheckoutLoadingId(productId)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, termsAccepted: agreedToTermsId === productId })
            })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                setCheckoutLoadingId(null)
            }
        } catch (error) {
            console.log(error)
            setCheckoutLoadingId(null)
        }
    }

    const isLoadingList = loading && !customProduct

    return(
        <>
        {showArrows && <CaretDoubleLeft className={`hidden sm:block shrink-0 transition-opacity duration-150 ${isAtStart ? "opacity-30 cursor-default" : "opacity-70 hover:opacity-100 cursor-pointer"}`}
                                        onClick={handleScrollLeft} size={32}/>}
        <ul ref={containerRef} className={`${styles.productsContainerStyles} scrollbar-hide`}>
            {isLoadingList ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <li className={styles.productsWrapperStyles} key={index}>
                    <div className={`${styles.imageWrapperStyles} animate-pulse bg-black/5`}/>
                    <div className={styles.textItemsWrapperStyles}>
                        <div className="flex w-full flex-1 flex-col gap-2">
                            <div className="h-4 w-3/4 animate-pulse rounded-full bg-black/10"/>
                            {showPrice && <div className="h-4 w-1/4 animate-pulse rounded-full bg-black/10"/>}
                        </div>
                    </div>
                </li>
            )) : productsToShow?.map((item:ProductsType, index:number) => {
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
                                <div className="mt-8 flex flex-col gap-3">
                                    <label className="flex items-start gap-2 text-xs text-ink-strong/60">
                                        <input
                                            type="checkbox"
                                            checked={agreedToTermsId === item.id}
                                            onChange={e => setAgreedToTermsId(e.target.checked ? item.id : null)}
                                            className="mt-0.5 h-4 w-4 shrink-0 accent-black"
                                        />
                                        <span>I understand I&apos;ll get instant access to this digital plan right after payment.</span>
                                    </label>
                                    <Button
                                        onClick={(e: React.MouseEvent) => handleBuyNow(e, item.id)}
                                        disabled={checkoutLoadingId === item.id || agreedToTermsId !== item.id}
                                        variant="solid"
                                        size="sm"
                                        fullWidth
                                    >
                                        {checkoutLoadingId === item.id ? "Redirecting…" : "Buy Now"}
                                    </Button>
                                </div>
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
