import { getServerClient } from "./server-client"
import { calculateNutritionTargets, type Goal } from "@/utils/nutritionEngine"
import type { Database } from "./database.types"

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
type PurchaseInsert = Database["public"]["Tables"]["purchases"]["Insert"]
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
type EntitlementInsert = Database["public"]["Tables"]["entitlements"]["Insert"]
type EntitlementStatus = Database["public"]["Tables"]["entitlements"]["Row"]["status"]
type BodyLogInsert = Database["public"]["Tables"]["body_logs"]["Insert"]
type NutritionTargetInsert = Database["public"]["Tables"]["nutrition_targets"]["Insert"]
type DailyIntakeInsert = Database["public"]["Tables"]["daily_intake_logs"]["Insert"]
type WorkoutSetLogInsert = Database["public"]["Tables"]["workout_set_logs"]["Insert"]

export const getActiveProducts = async () => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, image, description, price")
        .eq("is_subscription", false)
        .order("sort_order", { ascending: true })

    if (error) throw error
    return data
}

export const getAllProductBasics = async () => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("products")
        .select("name, description, image")
        .eq("is_subscription", false)
    return data
}

export const getProductForCheckout = async (id: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price, is_subscription, stripe_price_id")
        .eq("id", Number(id))
        .single()

    return error ? null : data
}

export const getProductForFulfillment = async (id: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, download_url")
        .eq("id", Number(id))
        .single()

    return error ? null : data
}

export const getProductForEntitlement = async (id: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, grants_module")
        .eq("id", Number(id))
        .single()

    return error ? null : data
}

export const countRecentLeadSubmissions = async (ip: string, windowStart: string) => {
    const supabase = getServerClient()
    const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", windowStart)

    if (error) throw error
    return count ?? 0
}

export const insertLead = async (lead: LeadInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("leads").insert(lead)
    if (error) throw error
}

export const getPurchaseBySessionId = async (sessionId: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("purchases")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle()

    return data
}

export const upsertPurchase = async (purchase: PurchaseInsert, ignoreDuplicates = false) => {
    const supabase = getServerClient()
    await supabase
        .from("purchases")
        .upsert(purchase, { onConflict: "session_id", ignoreDuplicates })
}

export const claimPurchaseDownload = async (sessionId: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("purchases")
        .update({ revealed_at: new Date().toISOString() })
        .eq("session_id", sessionId)
        .is("revealed_at", null)
        .select()
        .maybeSingle()

    return data
}

export const getOrCreateAuthUser = async (email: string, redirectTo: string) => {
    const supabase = getServerClient()

    const invite = await supabase.auth.admin.generateLink({ type: "invite", email, options: { redirectTo } })
    if (!invite.error) return invite.data

    const magicLink = await supabase.auth.admin.generateLink({ type: "magiclink", email, options: { redirectTo } })
    if (magicLink.error) throw magicLink.error
    return magicLink.data
}

export const sendLoginLink = async (email: string, redirectTo: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase.auth.admin.generateLink({ type: "magiclink", email, options: { redirectTo } })
    return error ? null : data
}

export const upsertProfile = async (profile: ProfileInsert) => {
    const supabase = getServerClient()
    await supabase.from("profiles").upsert(profile)
}

export const insertBodyLog = async (log: BodyLogInsert) => {
    const supabase = getServerClient()
    await supabase.from("body_logs").upsert(log, { onConflict: "user_id,logged_at" })
}

export const getEntitlementsForUser = async (userId: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("entitlements")
        .select("module, status")
        .eq("user_id", userId)

    if (error) throw error
    return data
}

export const getProfile = async (userId: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    return data
}

export const upsertEntitlement = async (entitlement: EntitlementInsert) => {
    const supabase = getServerClient()
    await supabase
        .from("entitlements")
        .upsert(entitlement, { onConflict: "user_id,module" })
}

export const updateEntitlementBySubscriptionId = async (
    subscriptionId: string,
    status: EntitlementStatus,
    currentPeriodEnd: string
) => {
    const supabase = getServerClient()
    // A bundle purchase shares one stripe_subscription_id across multiple entitlement
    // rows (one per module), so this can update more than one row — don't assume a
    // single row back.
    const { data } = await supabase
        .from("entitlements")
        .update({ status, current_period_end: currentPeriodEnd })
        .eq("stripe_subscription_id", subscriptionId)
        .select("user_id")

    return data?.[0] ?? null
}

export const getLatestBodyWeight = async (userId: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("body_logs")
        .select("weight_kg")
        .eq("user_id", userId)
        .order("logged_at", { ascending: false })
        .limit(1)
        .maybeSingle()

    return data?.weight_kg ?? null
}

export const getBodyLogHistory = async (userId: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("body_logs")
        .select("logged_at, weight_kg")
        .eq("user_id", userId)
        .order("logged_at", { ascending: true })

    if (error) throw error
    return data
}

export const getMealsForDate = async (userId: string, date: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("daily_intake_logs")
        .select("id, meal_type, name, calories, protein_g, fat_g, carbs_g")
        .eq("user_id", userId)
        .eq("logged_date", date)
        .order("created_at", { ascending: true })

    if (error) throw error
    return data
}

export const getTodayMeals = async (userId: string) => {
    const today = new Date().toISOString().slice(0, 10)
    return getMealsForDate(userId, today)
}

export const insertMeal = async (meal: DailyIntakeInsert) => {
    const supabase = getServerClient()
    await supabase.from("daily_intake_logs").insert(meal)
}

export const getIntakeHistory = async (userId: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("daily_intake_logs")
        .select("logged_date, calories")
        .eq("user_id", userId)
        .order("logged_date", { ascending: false })

    if (error) throw error
    return data
}

export const getLatestNutritionTarget = async (userId: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("nutrition_targets")
        .select("*")
        .eq("user_id", userId)
        .order("week_number", { ascending: false })
        .limit(1)
        .maybeSingle()

    return data
}

const insertNutritionTarget = async (target: NutritionTargetInsert) => {
    const supabase = getServerClient()
    await supabase.from("nutrition_targets").insert(target)
}

export const recalculateNutritionTargetIfActive = async (userId: string) => {
    const [profile, entitlements, weight, latestTarget] = await Promise.all([
        getProfile(userId),
        getEntitlementsForUser(userId),
        getLatestBodyWeight(userId),
        getLatestNutritionTarget(userId),
    ])

    const hasNutrition = entitlements.some(e => e.module === "nutrition" && e.status === "active")
    if (!hasNutrition) return

    if (!profile?.gender || !profile.age || !profile.height_cm || !profile.goal || !profile.activity_level || !weight) return

    const hasTraining = entitlements.some(e => e.module === "training" && e.status === "active")
    const accountsForTraining = hasTraining || profile.trains_with_program

    const result = calculateNutritionTargets({
        gender: profile.gender,
        age: profile.age,
        heightCm: profile.height_cm,
        weightKg: weight,
        goal: profile.goal as Goal,
        activityLevel: profile.activity_level,
        accountsForTraining,
    })

    await insertNutritionTarget({
        user_id: userId,
        week_number: (latestTarget?.week_number ?? -1) + 1,
        calories: result.calories,
        protein_g: result.proteinG,
        fat_g: result.fatG,
        carbs_g: result.carbsG,
        accounts_for_training: accountsForTraining,
    })
}

// Training engine
//
// day_of_week follows ISO weekday numbering: 1 = Monday ... 7 = Sunday.
// Days with no rows in this template are rest days.
const DEFAULT_SPLIT_TEMPLATE: {
    dayOfWeek: number
    exerciseName: string
    sets: number
    reps: number
    weightKg: number
}[] = [
    { dayOfWeek: 1, exerciseName: "Barbell Bench Press", sets: 4, reps: 8, weightKg: 60 },
    { dayOfWeek: 1, exerciseName: "Seated Dumbbell Press", sets: 3, reps: 12, weightKg: 18 },
    { dayOfWeek: 1, exerciseName: "Triceps Pushdown", sets: 3, reps: 12, weightKg: 20 },
    { dayOfWeek: 2, exerciseName: "Deadlift", sets: 4, reps: 6, weightKg: 100 },
    { dayOfWeek: 2, exerciseName: "Barbell Row", sets: 4, reps: 10, weightKg: 50 },
    { dayOfWeek: 2, exerciseName: "Barbell Curl", sets: 3, reps: 12, weightKg: 15 },
    { dayOfWeek: 3, exerciseName: "Back Squat", sets: 4, reps: 8, weightKg: 70 },
    { dayOfWeek: 3, exerciseName: "Leg Press", sets: 3, reps: 12, weightKg: 100 },
    { dayOfWeek: 3, exerciseName: "Standing Calf Raise", sets: 4, reps: 15, weightKg: 40 },
    { dayOfWeek: 5, exerciseName: "Incline Bench Press", sets: 4, reps: 8, weightKg: 50 },
    { dayOfWeek: 5, exerciseName: "Lat Pulldown", sets: 4, reps: 10, weightKg: 45 },
    { dayOfWeek: 5, exerciseName: "Lateral Raise", sets: 3, reps: 15, weightKg: 8 },
    { dayOfWeek: 6, exerciseName: "Front Squat", sets: 4, reps: 6, weightKg: 50 },
    { dayOfWeek: 6, exerciseName: "Romanian Deadlift", sets: 3, reps: 10, weightKg: 60 },
    { dayOfWeek: 6, exerciseName: "Leg Curl", sets: 3, reps: 12, weightKg: 30 },
]

export const getOrCreateTrainingPlan = async (userId: string) => {
    const supabase = getServerClient()

    const { data: existing } = await supabase
        .from("training_plans")
        .select("id")
        .eq("user_id", userId)
        .order("week_number", { ascending: false })
        .limit(1)
        .maybeSingle()

    if (existing) return existing.id

    const { data: plan, error: planError } = await supabase
        .from("training_plans")
        .insert({ user_id: userId, week_number: 0, template_name: "Default split" })
        .select("id")
        .single()

    if (planError) throw planError

    const { data: exerciseRows, error: exerciseError } = await supabase
        .from("exercises")
        .select("id, name")

    if (exerciseError) throw exerciseError

    const exerciseIdByName = new Map(exerciseRows.map(e => [e.name, e.id]))

    const planExercises = DEFAULT_SPLIT_TEMPLATE.map((item, index) => ({
        training_plan_id: plan.id,
        exercise_id: exerciseIdByName.get(item.exerciseName)!,
        day_of_week: item.dayOfWeek,
        target_sets: item.sets,
        target_reps: item.reps,
        target_weight_kg: item.weightKg,
        order_index: index,
    })).filter(row => row.exercise_id)

    const { error: insertError } = await supabase.from("plan_exercises").insert(planExercises)
    if (insertError) throw insertError

    return plan.id
}

export type TrainingPlanExercise = {
    planExerciseId: number
    name: string
    muscleGroup: string
    sets: number
    reps: number
    weightKg: number | null
}

export const getTrainingPlanWithExercises = async (userId: string) => {
    const planId = await getOrCreateTrainingPlan(userId)
    const supabase = getServerClient()

    const { data, error } = await supabase
        .from("plan_exercises")
        .select("id, day_of_week, target_sets, target_reps, target_weight_kg, order_index, exercises(name, muscle_group)")
        .eq("training_plan_id", planId)
        .order("day_of_week", { ascending: true })
        .order("order_index", { ascending: true })

    if (error) throw error

    const byDay = new Map<number, TrainingPlanExercise[]>()
    for (const row of data) {
        const exercise = Array.isArray(row.exercises) ? row.exercises[0] : row.exercises
        if (!exercise) continue
        const list = byDay.get(row.day_of_week) ?? []
        list.push({
            planExerciseId: row.id,
            name: exercise.name,
            muscleGroup: exercise.muscle_group,
            sets: row.target_sets,
            reps: row.target_reps,
            weightKg: row.target_weight_kg,
        })
        byDay.set(row.day_of_week, list)
    }

    return byDay
}

export const getWorkoutLogsForDate = async (userId: string, date: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("workout_set_logs")
        .select("plan_exercise_id, set_number, actual_reps, actual_weight_kg, effort")
        .eq("user_id", userId)
        .gte("performed_at", `${date}T00:00:00.000Z`)
        .lt("performed_at", `${date}T23:59:59.999Z`)

    if (error) throw error
    return data
}

export const insertWorkoutSetLog = async (log: WorkoutSetLogInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("workout_set_logs").insert(log)
    if (error) throw error
}
