import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ForkKnife } from "@phosphor-icons/react/dist/ssr"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getProductPrice, getNutritionTargetForDate, getMealsForDate, checkAndAdjustNutritionTargetForTrend } from "@/supabase/queries"
import NutritionCalendarStrip from "../NutritionCalendarStrip"
import AddModuleButton from "../AddModuleButton"
import NutritionContent from "./NutritionContent"
import { BUNDLE_PRODUCT_ID } from "@/data/products"
import { getModuleState, upsellCopy } from "@/utils/entitlements"
import { getTodayLocalDate, toLocalDateString } from "@/utils/date"

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
    const today = getTodayLocalDate()
    const selectedDate = date ?? today
    const isToday = selectedDate === today
    const isFuture = selectedDate > today

    // A week ahead is navigable as a read-only preview of the current daily target —
    // there's nothing to log yet for a day that hasn't happened.
    const maxDateObj = new Date(`${today}T00:00:00`)
    maxDateObj.setDate(maxDateObj.getDate() + 7)
    const maxDate = toLocalDateString(maxDateObj)

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

    // Only worth checking when looking at "today" — this can insert a new target, and
    // that should only ever happen in response to the user actually being here today,
    // not as a side effect of browsing history or the next-week preview.
    if (isToday) await checkAndAdjustNutritionTargetForTrend(user.id)

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
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                     <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                        <ForkKnife size={16} weight="bold"/>
                    </span>
                    <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Nutrition</h1>
                </div>
                <Link
                    href="/my-profile/nutrition/recipes"
                    className="flex items-center gap-1.5 rounded-full bg-black/[0.045] px-4 py-2 text-sm font-medium text-ink-strong transition-colors duration-200 hover:bg-black hover:text-white"
                >
                    <ForkKnife size={14} weight="bold"/> Recipes
                </Link>
            </div>

            <NutritionCalendarStrip date={selectedDate} maxDate={maxDate}/>

            <NutritionContent
                selectedDate={selectedDate}
                isToday={isToday}
                isFuture={isFuture}
                targetCalories={target?.calories ?? null}
                eatenCalories={eaten.calories}
                macroCards={macroCards}
                meals={meals}
            />
        </div>
    )
}
