import { ProductsProvider } from "@/context/ProductsContext"
import Products from "@/components/Products"
import { babes } from "../fonts"

export const metadata = {
    title: "Programs - Online Coaching & Fitness Programs",
    description: "Discover science-based fitness programs designed to help you lose fat, build muscle, and boost energy. Find the perfect plan tailored to your goals and lifestyle.",
}

const Programs = () => {
    return(
        <section className="pt-10 pb-5 px-5 lg:px-15">
            <h1 className={`${babes.className} py-6 text-2xl sm:text-3xl lg:text-4xl text-start lg:text-center`}>All Programs</h1>
            <ProductsProvider>
                <Products variants="programs" showBuy={false} showDescription={false}/>
            </ProductsProvider>
        </section>
    )
}

export default Programs