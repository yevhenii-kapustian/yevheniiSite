'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useRef } from "react";


type ProductsContextType = {
    containerRef: (node: HTMLUListElement | null) => void,
    isAtStart: boolean,
    isAtEnd: boolean,
    handleScrollLeft: () => void,
    handleScrollRight: () => void,
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({children} : {children:ReactNode}) => {

    const nodeRef = useRef<HTMLUListElement | null>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const updateScrollState = () => {
        const node = nodeRef.current;
        if (!node) return;
        const { scrollLeft, scrollWidth, clientWidth } = node;

        setIsAtStart(scrollLeft <= 0);
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    // A callback ref (instead of a plain useRef) so we notice every time the
    // carousel's <ul> is attached/detached — e.g. when navigating away from
    // and back to a page that renders it. ProductsProvider itself lives in
    // the root layout and never remounts, so a one-time useEffect would only
    // ever see the very first <ul>.
    const containerRef = useCallback((node: HTMLUListElement | null) => {
        if (nodeRef.current) {
            nodeRef.current.removeEventListener("scroll", updateScrollState);
        }

        nodeRef.current = node;

        if (node) {
            node.addEventListener("scroll", updateScrollState);
            updateScrollState();
        } else {
            setIsAtStart(true);
            setIsAtEnd(false);
        }
    }, []);

    const getScrollStep = (): number => {
        const container = nodeRef.current;
        if (!container || !container.firstElementChild) return 0;

        const card = container.firstElementChild as HTMLElement;
        const gap = parseFloat(window.getComputedStyle(container).columnGap || "0");

        return card.getBoundingClientRect().width + gap;
    };

    const handleScrollLeft = () => {
        if (nodeRef.current) {
            nodeRef.current.scrollBy({
                left: -getScrollStep(),
                behavior: 'smooth',
            });
        }
    };

    const handleScrollRight = () => {
        if (nodeRef.current) {
            nodeRef.current.scrollBy({
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
