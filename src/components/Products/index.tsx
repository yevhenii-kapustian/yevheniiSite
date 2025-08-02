'use client'

import Image from "next/image";
import { products } from "@/data/products"
import { ProductsType } from "@/types/products";
import { variantsStyles } from "./styles";
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
                                            <p className="text-[12px]">
                                                <a href="/">Home {'>'} </a>
                                                <a href="/programs">Programs {'>'} </a>
                                                <a href={`/programs/${learnMoreLink}`}>{item.name}</a>
                                            </p> 
                            )}
                            {showName && <h4 className={styles.nameProductStyles}>{item.name}</h4> }
                            {showPrice && <p>{fromattedCurrancy(item.price)}</p> }
                            {showDescription && (
                                <div className="mt-3 pt-3 border-t border-t-[rgba(0,0,0,0.2)]">
                                    <h5 className="font-bold uppercase">What's Inside:</h5>
                                    <p className={styles.subDescriptionProductStyles}>{item.description}</p> 
                                </div>
                            )}
                            {showBuy && <Link target="_ablank" href={item.buyProduct} className={styles.buttonStyles}>Buy Now</Link> }
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