import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getProfile, getLatestNutritionTarget, getLatestBodyWeight, getMealsForDate, getTrainingPlanWithExercises, type TrainingPlanExercise } from "@/supabase/queries"
import MyPlanContent from "./MyPlanContent"

export const metadata: Metadata = {
    title: "My Plan - Yevhenii Fit",
}

const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
}

type PageProps = {
    searchParams: Promise<{ date?: string }>
}

export default async function MyProfile ({ searchParams }: PageProps) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const today = new Date().toISOString().slice(0, 10)
    const { date } = await searchParams
    const selectedDate = date && date <= today ? date : today
    const isToday = selectedDate === today

    const [entitlements, profile, nutritionTarget, weight, meals] = await Promise.all([
        getEntitlementsForUser(user.id),
        getProfile(user.id),
        getLatestNutritionTarget(user.id),
        getLatestBodyWeight(user.id),
        getMealsForDate(user.id, selectedDate),
    ])

    const activeModules = entitlements.filter(e => e.status === "active").map(e => e.module)
    const hasTraining = activeModules.includes("training")
    const eatenSelected = {
        calories: meals.reduce((sum, meal) => sum + meal.calories, 0),
        proteinG: meals.reduce((sum, meal) => sum + (meal.protein_g ?? 0), 0),
        fatG: meals.reduce((sum, meal) => sum + (meal.fat_g ?? 0), 0),
        carbsG: meals.reduce((sum, meal) => sum + (meal.carbs_g ?? 0), 0),
    }

    const planByDay = hasTraining ? await getTrainingPlanWithExercises(user.id) : new Map<number, TrainingPlanExercise[]>()
    const weekDays = Array.from({ length: 7 }, (_, i) => ({
        dayOfWeek: i + 1,
        muscleGroups: Array.from(new Set((planByDay.get(i + 1) ?? []).map(e => e.muscleGroup))),
    }))

    return (
        <MyPlanContent
            email={user.email!}
            fullName={profile?.full_name ?? null}
            dateLabel={new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
            greeting={getGreeting()}
            hasNutrition={activeModules.includes("nutrition")}
            hasTraining={hasTraining}
            trainsWithProgram={profile?.trains_with_program ?? false}
            activityLevel={profile?.activity_level ?? null}
            accountsForTraining={hasTraining || (profile?.trains_with_program ?? false)}
            checkIn={{
                gender: profile?.gender === "female" ? "female" : "male",
                age: profile?.age ?? 28,
                height: profile?.height_cm ?? 178,
                weight: weight ?? 80,
                goal: (profile?.goal as "fat_loss" | "maintenance" | "muscle_gain" | null) ?? "maintenance",
            }}
            nutritionTarget={nutritionTarget ? {
                calories: nutritionTarget.calories,
                proteinG: nutritionTarget.protein_g,
                fatG: nutritionTarget.fat_g,
                carbsG: nutritionTarget.carbs_g,
            } : null}
            selectedDate={selectedDate}
            isToday={isToday}
            todayMaxDate={today}
            eatenSelected={eatenSelected}
            meals={meals.map(m => ({ id: m.id, name: m.name, mealType: m.meal_type, calories: m.calories, createdAt: m.created_at }))}
            weekDays={weekDays}
        />
    )
}
