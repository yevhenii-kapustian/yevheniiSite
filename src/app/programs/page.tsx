import { ProductsProvider } from "@/context/ProductsContext"
import Products from "@/components/Products"

export const metadata = {
    title: "Programs",
    description: "Discover science-based fitness programs designed to help you lose fat, build muscle, and boost energy. Find the perfect plan tailored to your goals and lifestyle.",
}

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