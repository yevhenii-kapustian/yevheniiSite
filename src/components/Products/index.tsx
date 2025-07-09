'use client'

import Image from "next/image";
import { products } from "@/data/products"
import { ProductsType } from "@/types/products";
import { variantsStyles } from "./styles";
import Link from "next/link";
import { fromattedCurrancy } from "@/utils/currency";
import { useRouter } from "next/navigation";

type ProductsPropsType = {
    showName?: boolean,
    showDescription?: boolean,
    showPrice?: boolean,
    showBuy?: boolean,
    showLernMore?: boolean,
    product?: ProductsType[],
    variants?: "home" | "programs"
}

const Products = ({showName = true, 
                   showDescription = true, 
                   showPrice = true, 
                   showBuy = true, 
                   showLernMore = true,
                   product: customProduct,
                   variants="home"}: ProductsPropsType) => {

    const allProducts = products.get('plans');
    const productsToShow = customProduct ?? allProducts;
    const styles = variantsStyles[variants]
    const router = useRouter()

    return(
        <ul className={`${styles.productsContainerStyles} overflow-x-auto scrollbar-hide snap-x snap-mandatory`}>
            {productsToShow?.map((item:ProductsType, index:number) => (
                <li
                    className={`${styles.productsWrapperStyles} max-sm:w-1/2 snap-center`} 
                    key={index}>
                    <div onClick={() => router.push(`/programs/${item.name.toLowerCase()}`)}
                         className="cursor-pointer"
                    >
                        <Image className={styles.imageProductStyles} src={item.image} alt={item.name} width={1000} height={1000} priority/>
                        <div className={styles.textItemsWrapperStyles}>
                            {showName && <h4 className={styles.nameProductStyles}>{item.name}</h4> }
                            {showDescription && <p>{item.description}</p> }
                            {showPrice && <p>{fromattedCurrancy(item.price)}</p> }
                            {showBuy && <Link target="_ablank" href={item.pathToProduct} className={styles.buttonStyles}>Buy Now</Link> }
                            {/* {showLernMore && <Link href={`/programs/${item.name.toLowerCase()}`} className={styles.buttonStyles}>Learn More</Link> } */}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default Products