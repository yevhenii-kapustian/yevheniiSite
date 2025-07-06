'use client'

import Image from "next/image";
import { products } from "@/data/products"
import { useProducts } from "@/context/ProductsContext";
import { ProductsType } from "@/types/products";
import { motion, useInView} from 'framer-motion'
import { useRef } from "react"
import { productsContainerStyles,
         productsWrapperStyles,
         textItemsWrapperStyles, 
         buttonStyles } from "./styles";
import { productVisibility } from "./animations";
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
                    
    const { handleSave, handleLearnMore } = useProducts();
    const allProducts = products.get('plans');
    const productsToShow = customProduct ?? allProducts;

    const ref = useRef(null)
    const isInView = useInView(ref)

    return(
        <>
        <motion.ul ref={ref} className={productsContainerStyles}>
            {productsToShow?.map((item:ProductsType, index:number) => {
                const now = Date.now();
                const successUrl = `https://yevhenii-site.vercel.app/success?product=${encodeURIComponent(item.name)}&t=${now}`;
                const fullBuyLink = `${item.pathToProduct}?success_url=${encodeURIComponent(successUrl)}`;
                return(
                    <motion.li
                            className={productsWrapperStyles} 
                            variants={productVisibility}
                            initial='hidden'
                            animate={isInView ? "visible" : "hidden"}
                            whileHover='hover'
                            whileTap='tap'
                            custom={index}
                            key={index}>
                        <Image className="rounded-xl" src={item.image} alt={item.name} width={1000} height={1000} priority/>
                        <div className={textItemsWrapperStyles}>
                            {showName && <h4 className="text-xl font-bold uppercase">{item.name}</h4> }
                            {showDescription && <p>{item.description}</p> }
                            {showPrice && <p><strong>Price:</strong> {item.price}</p> }
                            {showBuy && <Link target="_ablank" href={fullBuyLink} className={buttonStyles}>Buy Now</Link> }
                            {showLernMore && <Link href={`/programs/${item.name.toLocaleLowerCase()}`} className={buttonStyles}>Learn More</Link> }
                        </div>
                    </motion.li>
                )
                })}
        </motion.ul>
        </>
    )
}

export default Products