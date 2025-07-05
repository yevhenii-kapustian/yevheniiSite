import { ProductsProvider } from "@/context/ProductsContext"
import Products from "@/components/Products"

const Programs = () => {
    return(
        <section className="pt-[80px]">
            <ProductsProvider>
                <Products/>
            </ProductsProvider>
        </section>
    )
}

export default Programs