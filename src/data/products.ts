import { ProductsType } from "@/types/products"

export const products = new Map<string, ProductsType[]>([
    ['plans', [
        {
            name: "4 Weeks Mass Builder",
            image: "/images/products/gainMuscles.png",
            description: `• A 4-week progressive training split, perfect for beginners and anyone looking to build muscle effectively
                        • Step-by-step video demonstrations and detailed instructions for every exercise — train safely and correctly
                        • Load progression system designed to help you continuously improve and avoid plateaus
                        • Clear weekly structure — just follow the plan and see results every week
                        • Basic nutritional recommendations to support muscle growth and recovery
                        • Suitable for both home and gym workouts — maximize your gains with minimal equipment`,
            price: 199,
            buyProduct: "https://buy.stripe.com/4gMcN57dl95w4oZ1d61RC04",
        },
        {
            name: "Bye-Bye, Belly Fat!",
            image: "/images/products/loseWeight.png",
            description: `• 4-week training plan focused on fat-burning
                            • All exercises with video breakdowns & written explanations
                            • Weekly split example
                            • Quick Nutrition Tips for Fat Loss`,
            price: 149,
            buyProduct: "https://buy.stripe.com/5kQcN58hpftU5t3cVO1RC05",
        },
        {
            name: "The Fuel Plan",
            image: "/images/products/nutritionPlans.png",
            description: `• Step-by-step guide to calculating your daily calories & macros
                            • Learn how to balance your Protein / Fats / Carbs
                            • What to eat — and why
                            • Supplements & Vitamins: What Matters`,
            price: 199,
            buyProduct: "https://buy.stripe.com/fZu9ATbtBa9AbRr5tm1RC06",
        },
        {
            name: "30-day Body Transformation",
            image: "/images/products/30dayBodyTransformation.png",
            description: `• Daily workout schedule
                            • Progression by Week
                            • All exercises with video breakdowns & written explanations
                            • Basic Nutritional Recommendations`,
            price: 199,
            buyProduct: "https://buy.stripe.com/7sYaEXgNV2H81cN8Fy1RC07",
        },
        {
            name: "Strong & Slim: Glute + Core Sculpt",
            image: "/images/products/glute&coreSculpt.png",
            description: `• 4-Week Schedule by Week
                            • All exercises with video demos & explanations
                            • What weight should you choose
                            • Nutritional Recommendations`,
            price: 149,
            buyProduct: "https://buy.stripe.com/4gMaEX2X5gxY7Bb5tm1RC08",
        }
    ]]
])