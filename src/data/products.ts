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
            description: `• A 4-week fat-burning training plan designed to help you torch stubborn fat and boost your energy!
                            • Step-by-step exercise videos paired with clear written instructions—perfect for all fitness levels
                            • A sample weekly workout split to keep you organized and motivated throughout your journey
                            • Quick and easy nutrition tips for fat loss—no complicated diets, just practical advice for lasting results!`,
            price: 149,
            buyProduct: "https://buy.stripe.com/5kQcN58hpftU5t3cVO1RC05",
        },
        {
            name: "The Fuel Plan",
            image: "/images/products/nutritionPlans.png",
            description: `• A clear, step-by-step guide to calculating your daily calories and macros tailored just for you
                            • Master the art of balancing protein, fats, and carbs to fuel your body the right way
                            • Discover exactly what to eat — and why each choice matters for your goals
                            • Unlock the truth about supplements and vitamins: what truly makes a difference`,
            price: 199,
            buyProduct: "https://buy.stripe.com/fZu9ATbtBa9AbRr5tm1RC06",
        },
        {
            name: "30-day Body Transformation",
            image: "/images/products/30dayBodyTransformation.png",
            description: `• A clear daily workout schedule designed to keep you motivated and consistent
                            • Weekly progressions that help you level up safely and effectively
                            • Step-by-step video tutorials and easy-to-follow explanations for every exercise
                            • Simple yet powerful basic nutrition tips to fuel your transformation`,
            price: 199,
            buyProduct: "https://buy.stripe.com/7sYaEXgNV2H81cN8Fy1RC07",
        },
        {
            name: "Strong & Slim: Glute + Core Sculpt",
            image: "/images/products/glute&coreSculpt.png",
            description: `• A detailed 4-week training roadmap to keep you on track and motivated
                            • Comprehensive video demos and clear explanations for every exercise — perfect form guaranteed!
                            • Expert tips on choosing the right weights to maximize gains and avoid injury
                            • Practical nutritional recommendations to fuel your progress and boost recovery`,
            price: 149,
            buyProduct: "https://buy.stripe.com/4gMaEX2X5gxY7Bb5tm1RC08",
        }
    ]]
])