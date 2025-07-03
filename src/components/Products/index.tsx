'use client'

import Image from "next/image";
import { products } from "@/data/products"
import { useProducts } from "@/context/ProductsContext";
import { ProductsType } from "@/types/products";
import { motion, useInView, useScroll} from 'framer-motion'
import { useRef } from "react"
import { useProductsMask } from "./animations";
import { productsContainerStyles,
         productsWrapperStyles,
         textItemsWrapperStyles, 
         buttonStyles } from "./styles";
import { productVisibility } from "./animations";

type ProductsPropsType = {
    showName?: boolean,
    showDescription?: boolean,
    showPrice?: boolean,
    showBuy?: boolean,
    showLernMore?: boolean
}

const Products = ({showName = true, 
                   showDescription = true, 
                   showPrice = true, 
                   showBuy = true, 
                   showLernMore = true}: ProductsPropsType) => {
                    
    const { savedProducts, handleSave } = useProducts();
    const getProducts = products.get('plans');

    const ref = useRef(null)
    const { scrollXProgress } = useScroll({ container: ref })
    const maskImage = useProductsMask(scrollXProgress)
    const isInView = useInView(ref)

        
    console.log(savedProducts);

    return(
        <>
        <motion.ul ref={ref} style={{maskImage}} className={productsContainerStyles}>
            {getProducts?.map((item:ProductsType, index:number) => (
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
                        {showBuy && <button className={buttonStyles} onClick={() => handleSave(item)}>Buy Now</button> }
                        {showLernMore && <a className={buttonStyles} href="#">Learn More</a> }
                    </div>
                </motion.li>
            ))}
        </motion.ul>
        </>
    )
}

export default Products