'use client'

import Image from "next/image";
import { products } from "@/data/products"
import { ProductsType } from "@/types/products";
import { productsContainerStyles,
         productsWrapperStyles,
         textItemsWrapperStyles, 
         buttonStyles } from "./styles";
import Link from "next/link";

type ProductsPropsType = {
    showName?: boolean,
    showDescription?: boolean,
    showPrice?: boolean,
    showBuy?: boolean,
    showLernMore?: boolean,
    product?: ProductsType[]
}

const Products = ({showName = true, 
                   showDescription = true, 
                   showPrice = true, 
                   showBuy = true, 
                   showLernMore = true,
                   product: customProduct}: ProductsPropsType) => {

    const allProducts = products.get('plans');
    const productsToShow = customProduct ?? allProducts;

    return(
        <ul className={productsContainerStyles}>
            {productsToShow?.map((item:ProductsType, index:number) => (
                <li
                        className={productsWrapperStyles} 
                        key={index}>
                    <Image className="rounded-xl" src={item.image} alt={item.name} width={1000} height={1000} priority/>
                    <div className={textItemsWrapperStyles}>
                        {showName && <h4 className="text-xl font-bold uppercase">{item.name}</h4> }
                        {showDescription && <p>{item.description}</p> }
                        {showPrice && <p><strong>Price:</strong> {item.price}</p> }
                        {showBuy && <Link target="_ablank" href={item.pathToProduct} className={buttonStyles}>Buy Now</Link> }
                        {showLernMore && <Link href={`/programs/${item.name.toLowerCase()}`} className={buttonStyles}>Learn More</Link> }
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default Products