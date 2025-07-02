import { ProductsType } from "@/types/products"

export const products = new Map<string, ProductsType[]>([
    ['plans', [
        {
            name: "Gain muscles",
            image: "/gainMuscles.png",
            description: "Build strength and size with targeted workouts and optimal nutrition.",
            price: 12,
        },
        {
            name: "Lose Weight",
            image: "/loseWeight.png",
            description: "Burn fat efficiently and reach your ideal shape with smart training and healthy habits.",
            price: 11
        },
        {
            name: "Nutrition Plans",
            image: "/nutritionPlans.png",
            description: "Fuel your body right with balanced, goal-focused meal plans tailored for results.",
            price: 9
        },
    ]]
])