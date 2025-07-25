import { ProductsType } from "@/types/products"

export const products = new Map<string, ProductsType[]>([
    ['plans', [
        {
            name: "4 Weeks Mass Builder",
            image: "/images/products/gainMuscles.png",
            description: `• 4-week progressive training split
                            • All exercises with video demos & written explanations
                            • Load Progression System
                            • Weekly structure
                            • Basic Nutritional Recommendations For Best Results`,
            price: 199,
            buyProduct: "https://buy.stripe.com/5kQ8wP9lt3Lc7Bb7Bu1RC02",
        },
        {
            name: "Bye-Bye, Belly Fat!",
            image: "/images/products/loseWeight.png",
            description: `• 4-week training plan focused on fat-burning
                            • All exercises with video breakdowns & written explanations
                            • Weekly split example
                            • Quick Nutrition Tips for Fat Loss`,
            price: 149,
            buyProduct: "https://buy.stripe.com/00w6oHapxbdEbRr3le1RC03",
        },
        {
            name: "The Fuel Plan",
            image: "/images/products/nutritionPlans.png",
            description: `• Step-by-step guide to calculating your daily calories & macros
                            • Learn how to balance your Protein / Fats / Carbs
                            • What to eat — and why
                            • Supplements & Vitamins: What Matters`,
            price: 199,
            buyProduct: "",
        },
        {
            name: "30-day Body Transformation",
            image: "/images/products/nutritionPlans.png",
            description: `• Daily workout schedule
                            • Progression by Week
                            • All exercises with video breakdowns & written explanations
                            • Basic Nutritional Recommendations`,
            price: 199,
            buyProduct: "",
        },
        {
            name: "Strong & Slim: Glute + Core Sculpt",
            image: "/images/products/nutritionPlans.png",
            description: `• 4-Week Schedule by Week
                            • All exercises with video demos & explanations
                            • What weight should you choose
                            • Nutritional Recommendations`,
            price: 149,
            buyProduct: "",
        }
    ]]
])