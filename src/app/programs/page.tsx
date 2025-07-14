import { ProductsProvider } from "@/context/ProductsContext"
import Products from "@/components/Products"
import { babes } from "../fonts"

export const metadata = {
    title: "Programs",
    description: "Discover science-based fitness programs designed to help you lose fat, build muscle, and boost energy. Find the perfect plan tailored to your goals and lifestyle.",
}

const Programs = () => {
    return(
        <section className="pt-[80px] pb-5 px-15">
            <h1 className={`${babes.className} py-5 text-center text-5xl`}>All Programs</h1>
            <ProductsProvider>
                <Products variants="programs" showBuy={false} showDescription={false}/>
            </ProductsProvider>
        </section>
    )
}

export default Programs