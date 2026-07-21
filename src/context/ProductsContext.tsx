'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";


type ProductsContextType = {
    containerRef: React.RefObject<HTMLUListElement | null>,
    isAtStart: boolean,
    isAtEnd: boolean,
    handleScrollLeft: () => void,
    handleScrollRight: () => void,
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({children} : {children:ReactNode}) => {


    const containerRef = useRef<HTMLUListElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const updateScrollState = () => {
        if (!containerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

        setIsAtStart(scrollLeft <= 0);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    useEffect(() => {
        updateScrollState();
        const container = containerRef.current;

        if (container) {
            container.addEventListener("scroll", updateScrollState);
            return () => container.removeEventListener("scroll", updateScrollState);
        }
    }, []);

    const getScrollStep = (): number => {
        const container = containerRef.current;
        if (!container || !container.firstElementChild) return 0;

        const card = container.firstElementChild as HTMLElement;
        const gap = parseFloat(window.getComputedStyle(container).columnGap || "0");

        return card.getBoundingClientRect().width + gap;
    };

    const handleScrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: -getScrollStep(),
                behavior: 'smooth',
            });
        }
    };

    const handleScrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({
                left: getScrollStep(),
                behavior: 'smooth',
            });
        }
    };

    return(
        <ProductsContext.Provider value={{isAtStart, isAtEnd, containerRef,
                                         handleScrollLeft, handleScrollRight
                                         }}>
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