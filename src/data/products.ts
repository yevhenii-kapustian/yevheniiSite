import { ProductsType } from "@/types/products"

export const products = new Map<string, ProductsType[]>([
    ['plans', [
        {
            name: "4 Weeks Mass Builder",
            image: "/images/products/gainMuscles.png",
            description: "",
            price: 199,
            buyProduct: "https://buy.stripe.com/5kQ8wP9lt3Lc7Bb7Bu1RC02",
        },
        {
            name: "Bye-Bye, Belly Fat!",
            image: "/images/products/loseWeight.png",
            description: "",
            price: 149,
            buyProduct: "https://buy.stripe.com/00w6oHapxbdEbRr3le1RC03",
        },
        {
            name: "The Fuel Plan",
            image: "/images/products/nutritionPlans.png",
            description: "",
            price: 199,
            buyProduct: "",
        },
        {
            name: "30-day Body Transformation",
            image: "/images/products/nutritionPlans.png",
            description: "",
            price: 199,
            buyProduct: "",
        },
        {
            name: "Strong & Slim: Glute + Core Sculpt",
            image: "/images/products/nutritionPlans.png",
            description: "",
            price: 149,
            buyProduct: "",
        }
    ]]
])