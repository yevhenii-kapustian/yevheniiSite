import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getProductPrice, getNutritionTargetForDate, getMealsForDate } from "@/supabase/queries"
import NutritionCalendarStrip from "../NutritionCalendarStrip"
import AddModuleButton from "../AddModuleButton"
import NutritionContent from "./NutritionContent"
import { BUNDLE_PRODUCT_ID } from "@/data/products"
import { getModuleState, upsellCopy } from "@/utils/entitlements"

export const metadata: Metadata = {
    title: "Nutrition - Yevhenii Fit",
}

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
    const isFuture = selectedDate > today

    // A week ahead is navigable as a read-only preview of the current daily target —
    // there's nothing to log yet for a day that hasn't happened.
    const maxDateObj = new Date(`${today}T00:00:00`)
    maxDateObj.setDate(maxDateObj.getDate() + 7)
    const maxDate = maxDateObj.toISOString().slice(0, 10)

    const entitlements = await getEntitlementsForUser(user.id)
    const hasNutrition = entitlements.some(e => e.module === "nutrition" && e.status === "active")

    if (!hasNutrition) {
        const nutritionState = getModuleState(entitlements, "nutrition")
        const nutritionPeriodEnd = entitlements.find(e => e.module === "nutrition")?.current_period_end ?? null
        const bundlePrice = await getProductPrice(BUNDLE_PRODUCT_ID)
        const { message, buttonLabel } = upsellCopy(nutritionState, nutritionPeriodEnd, "You don't have a nutrition plan yet.", bundlePrice)

        return (
            <div className="flex flex-col gap-8">
                <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Nutrition</h1>
                <div className="flex flex-col items-start gap-3">
                    <p className="text-sm text-ink-strong/60">{message}</p>
                    <AddModuleButton productId={BUNDLE_PRODUCT_ID} email={user.email!} label={buttonLabel}/>
                </div>
            </div>
        )
    }

    const [target, meals] = await Promise.all([
        getNutritionTargetForDate(user.id, selectedDate),
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
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Nutrition</h1>

            <div className="flex flex-col gap-4">
                <p className="text-sm text-ink-strong/50">
                    {isToday ? "Today" : new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    {target && !isFuture && ` · ${Math.round(eaten.calories).toLocaleString("en-US")} / ${target.calories.toLocaleString("en-US")} kcal logged`}
                    {target && isFuture && ` · ${target.calories.toLocaleString("en-US")} kcal target (preview)`}
                </p>
                <NutritionCalendarStrip date={selectedDate} maxDate={maxDate}/>
            </div>

            <NutritionContent selectedDate={selectedDate} isToday={isToday} macroCards={macroCards} meals={meals}/>
        </div>
    )
}
