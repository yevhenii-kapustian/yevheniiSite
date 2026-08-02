import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getLatestNutritionTarget, getMealsForDate } from "@/supabase/queries"
import WeekDatePicker from "../WeekDatePicker"
import AddModuleButton from "../AddModuleButton"
import NutritionContent from "./NutritionContent"

export const metadata: Metadata = {
    title: "Nutrition - Yevhenii Fit",
}

const BUNDLE_PRODUCT_ID = "8"

type PageProps = {
    searchParams: Promise<{ date?: string }>
}

export default async function NutritionPage ({ searchParams }: PageProps) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const { date } = await searchParams
    const today = new Date().toISOString().slice(0, 10)
    const selectedDate = date ?? today
    const isToday = selectedDate === today

    const entitlements = await getEntitlementsForUser(user.id)
    const hasNutrition = entitlements.some(e => e.module === "nutrition" && e.status === "active")

    if (!hasNutrition) {
        return (
            <section className="px-5 py-16 sm:px-10 lg:px-20">
                <div className="mx-auto flex max-w-6xl flex-col gap-8">
                    <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">Nutrition</h1>
                    <div className="flex flex-col items-start gap-3">
                        <p className="text-sm text-ink-strong/60">You don&apos;t have a nutrition plan yet.</p>
                        <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={user.email!} label="Get full access — $45/mo"/>
                    </div>
                </div>
            </section>
        )
    }

    const [target, meals] = await Promise.all([
        getLatestNutritionTarget(user.id),
        getMealsForDate(user.id, selectedDate),
    ])

    const eaten = {
        calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
        protein_g: meals.reduce((sum, meal) => sum + (meal.protein_g ?? 0), 0),
        fat_g: meals.reduce((sum, meal) => sum + (meal.fat_g ?? 0), 0),
        carbs_g: meals.reduce((sum, meal) => sum + (meal.carbs_g ?? 0), 0),
    }

    const macroCards = target ? [
        { label: "Calories", eaten: eaten.calories, goal: target.calories, unit: "" },
        { label: "Protein", eaten: eaten.protein_g, goal: target.protein_g, unit: "g" },
        { label: "Fat", eaten: eaten.fat_g, goal: target.fat_g, unit: "g" },
        { label: "Carbs", eaten: eaten.carbs_g, goal: target.carbs_g, unit: "g" },
    ] : []

    return (
        <section className="px-5 py-16 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                <h1 className="text-3xl font-semibold text-ink-strong sm:text-4xl">Nutrition</h1>

                <div className="flex flex-col gap-4">
                    <p className="text-sm text-ink-strong/50">
                        {isToday ? "Today" : new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                        {target && ` · ${Math.round(eaten.calories).toLocaleString("en-US")} / ${target.calories.toLocaleString("en-US")} kcal logged`}
                    </p>
                    <WeekDatePicker date={selectedDate} maxDate={today}/>
                </div>

                <NutritionContent selectedDate={selectedDate} isToday={isToday} macroCards={macroCards} meals={meals}/>
            </div>
        </section>
    )
}
