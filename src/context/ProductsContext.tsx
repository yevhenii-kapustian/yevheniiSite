'use client'

import { createContext, useContext, useState, ReactNode } from "react";
import { ProductsType } from "@/types/products";

type ProductsContextType = {
    savedProducts: ProductsType[],
    handleSave: (item:ProductsType) => void,
    toShowProduct: ProductsType | null,
    handleLearnMore: (item:ProductsType) => void,
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({children} : {children:ReactNode}) => {
    const [savedProducts, setSavedProducts] = useState<ProductsType[]>([])
    const [toShowProduct, setToShowProduct] = useState<ProductsType | null>(null)

    const handleLearnMore = (item: ProductsType): void => {
        setToShowProduct(item)
    }
    
    const handleSave = (item: ProductsType): void => {
        if (savedProducts.includes(item)) return
        setSavedProducts((prev) => [...prev, item])
    }

    return(
        <ProductsContext.Provider value={{savedProducts, handleSave, toShowProduct, handleLearnMore}}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => {
    const context = useContext(ProductsContext)

    if (!context) {
        throw new Error("Context error")
    }

    return context
}