import { getServerClient } from "./server-client"
import { calculateNutritionTargets, type Goal } from "@/utils/nutritionEngine"
import { generateTrainingPlan, getISOWeekKey, getSplitLabel, getDefaultWeightForExercise, applyDeloadToWeight, type PreviousTarget } from "@/utils/planGenerator"
import { getStripe } from "@/lib/stripe"
import { getTodayLocalDate } from "@/utils/date"
import type { Database } from "./database.types"

type PurchaseInsert = Database["public"]["Tables"]["purchases"]["Insert"]
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]
type EntitlementInsert = Database["public"]["Tables"]["entitlements"]["Insert"]
type EntitlementStatus = Database["public"]["Tables"]["entitlements"]["Row"]["status"]
type BodyLogInsert = Database["public"]["Tables"]["body_logs"]["Insert"]
type NutritionTargetInsert = Database["public"]["Tables"]["nutrition_targets"]["Insert"]
type DailyIntakeInsert = Database["public"]["Tables"]["daily_intake_logs"]["Insert"]
type WorkoutSetLogInsert = Database["public"]["Tables"]["workout_set_logs"]["Insert"]
type RecipeInsert = Database["public"]["Tables"]["recipes"]["Insert"]

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

export const getProductPrice = async (id: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("price")
        .eq("id", Number(id))
        .single()

    return error ? null : data.price
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
    const { error } = await supabase
        .from("purchases")
        .upsert(purchase, { onConflict: "session_id", ignoreDuplicates })
    if (error) throw error
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
    const { error } = await supabase.from("profiles").upsert(profile)
    if (error) throw error
}

// Full account deletion (GDPR right-to-erasure). Purchase records are kept for
// accounting/tax purposes but disconnected from the person by nulling user_id — every
// other table is fully wiped before the auth user itself is deleted last. Also cancels
// any live Stripe subscription and removes Storage objects first — without this, a
// deleted user's card kept getting charged forever with no account left to manage it
// from, and their photos stayed in the bucket with nothing pointing at them.
export const deleteUserAccount = async (userId: string) => {
    const supabase = getServerClient()

    const { data: entitlements } = await supabase
        .from("entitlements")
        .select("stripe_subscription_id")
        .eq("user_id", userId)

    const subscriptionIds = Array.from(new Set((entitlements ?? [])
        .map(e => e.stripe_subscription_id)
        .filter((id): id is string => Boolean(id))))

    if (subscriptionIds.length > 0) {
        const stripe = getStripe()
        await Promise.all(subscriptionIds.map(async id => {
            try {
                await stripe.subscriptions.cancel(id)
            } catch (error) {
                // Already canceled/nonexistent subscriptions throw — that's fine, there's
                // nothing left to cancel. Anything else shouldn't block the deletion itself.
                console.error(`Failed to cancel Stripe subscription ${id} during account deletion:`, error)
            }
        }))
    }

    const { data: photos } = await supabase.from("progress_photos").select("storage_path").eq("user_id", userId)
    const storagePaths = (photos ?? []).map(p => p.storage_path)
    if (storagePaths.length > 0) {
        await supabase.storage.from("progress-photos").remove(storagePaths)
    }

    const { data: plans } = await supabase.from("training_plans").select("id").eq("user_id", userId)
    const planIds = (plans ?? []).map(p => p.id)
    if (planIds.length > 0) {
        await supabase.from("plan_exercises").delete().in("training_plan_id", planIds)
    }
    await supabase.from("training_plans").delete().eq("user_id", userId)

    await supabase.from("workout_set_logs").delete().eq("user_id", userId)
    await supabase.from("daily_intake_logs").delete().eq("user_id", userId)
    await supabase.from("body_logs").delete().eq("user_id", userId)
    await supabase.from("nutrition_targets").delete().eq("user_id", userId)
    await supabase.from("entitlements").delete().eq("user_id", userId)
    await supabase.from("progress_photos").delete().eq("user_id", userId)
    await supabase.from("body_measurements").delete().eq("user_id", userId)
    await supabase.from("purchases").update({ user_id: null }).eq("user_id", userId)
    await supabase.from("profiles").delete().eq("id", userId)

    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) throw error
}

export const insertBodyLog = async (log: BodyLogInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("body_logs").upsert(log, { onConflict: "user_id,logged_at" })
    if (error) throw error
}

export const deleteBodyLog = async (userId: string, loggedAt: string) => {
    const supabase = getServerClient()
    const { error } = await supabase
        .from("body_logs")
        .delete()
        .eq("user_id", userId)
        .eq("logged_at", loggedAt)

    if (error) throw error
}

type BodyMeasurementInsert = Database["public"]["Tables"]["body_measurements"]["Insert"]

// A plain upsert on (user_id, logged_at) overwrites the whole row — logging waist in the
// morning and hips in the evening of the same day silently nulled out the morning's waist
// value. Fetches today's existing row (if any) first and only overwrites fields the
// caller actually supplied a value for, so two partial logs on the same day merge instead
// of clobbering each other.
export const insertBodyMeasurement = async (measurement: BodyMeasurementInsert) => {
    const supabase = getServerClient()

    const { data: existing } = await supabase
        .from("body_measurements")
        .select("waist_cm, chest_cm, hips_cm, thigh_cm, arm_cm")
        .eq("user_id", measurement.user_id)
        .eq("logged_at", measurement.logged_at)
        .maybeSingle()

    const merged: BodyMeasurementInsert = existing
        ? {
            ...measurement,
            waist_cm: measurement.waist_cm ?? existing.waist_cm,
            chest_cm: measurement.chest_cm ?? existing.chest_cm,
            hips_cm: measurement.hips_cm ?? existing.hips_cm,
            thigh_cm: measurement.thigh_cm ?? existing.thigh_cm,
            arm_cm: measurement.arm_cm ?? existing.arm_cm,
        }
        : measurement

    const { error } = await supabase
        .from("body_measurements")
        .upsert(merged, { onConflict: "user_id,logged_at" })

    if (error) throw error
}

export const getBodyMeasurementHistory = async (userId: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("body_measurements")
        .select("id, logged_at, waist_cm, chest_cm, hips_cm, thigh_cm, arm_cm")
        .eq("user_id", userId)
        .order("logged_at", { ascending: false })

    if (error) throw error
    return data
}

export const deleteBodyMeasurement = async (userId: string, id: number) => {
    const supabase = getServerClient()
    const { error } = await supabase
        .from("body_measurements")
        .delete()
        .eq("id", id)
        .eq("user_id", userId)

    if (error) throw error
}

type ProgressPhotoInsert = Database["public"]["Tables"]["progress_photos"]["Insert"]

export const insertProgressPhoto = async (photo: ProgressPhotoInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("progress_photos").insert(photo)
    if (error) throw error
}

export const getProgressPhotosForUser = async (userId: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("progress_photos")
        .select("id, storage_path, label, taken_at")
        .eq("user_id", userId)
        .order("taken_at", { ascending: false })

    if (error) throw error
    return data
}

export const deleteProgressPhoto = async (userId: string, id: number) => {
    const supabase = getServerClient()
    const { data: photo } = await supabase
        .from("progress_photos")
        .select("storage_path")
        .eq("id", id)
        .eq("user_id", userId)
        .maybeSingle()

    if (!photo) return

    await supabase.storage.from("progress-photos").remove([photo.storage_path])
    const { error } = await supabase.from("progress_photos").delete().eq("id", id).eq("user_id", userId)
    if (error) throw error
}

export const getEntitlementsForUser = async (userId: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("entitlements")
        .select("module, status, stripe_subscription_id, current_period_end, cancel_at_period_end")
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
    const { error } = await supabase
        .from("entitlements")
        .upsert(entitlement, { onConflict: "user_id,module" })
    if (error) throw error
}

export const updateEntitlementBySubscriptionId = async (
    subscriptionId: string,
    status: EntitlementStatus,
    currentPeriodEnd: string,
    cancelAtPeriodEnd: boolean
) => {
    const supabase = getServerClient()
    // A bundle purchase shares one stripe_subscription_id across multiple entitlement
    // rows (one per module), so this can update more than one row — don't assume a
    // single row back.
    const { data, error } = await supabase
        .from("entitlements")
        .update({ status, current_period_end: currentPeriodEnd, cancel_at_period_end: cancelAtPeriodEnd })
        .eq("stripe_subscription_id", subscriptionId)
        .select("user_id")

    if (error) throw error
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
        .select("id, meal_type, name, calories, protein_g, fat_g, carbs_g, created_at")
        .eq("user_id", userId)
        .eq("logged_date", date)
        .order("created_at", { ascending: true })

    if (error) throw error
    return data
}

export const getTodayMeals = async (userId: string) => {
    const today = getTodayLocalDate()
    return getMealsForDate(userId, today)
}

export const insertMeal = async (meal: DailyIntakeInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("daily_intake_logs").insert(meal)
    if (error) throw error
}

export const deleteMeal = async (userId: string, mealId: number) => {
    const supabase = getServerClient()
    const { error } = await supabase
        .from("daily_intake_logs")
        .delete()
        .eq("id", mealId)
        .eq("user_id", userId)

    if (error) throw error
}

export const getIntakeHistory = async (userId: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("daily_intake_logs")
        .select("logged_date, calories, name, meal_type, protein_g, fat_g, carbs_g")
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

// The target that was actually in effect on a given calendar date — i.e. the most
// recent check-in at or before that date. Goals change over time (fat_loss one week,
// muscle_gain the next), so viewing a past day must show that day's real target
// instead of always falling back to today's.
export const getNutritionTargetForDate = async (userId: string, date: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("nutrition_targets")
        .select("*")
        .eq("user_id", userId)
        .lte("created_at", `${date}T23:59:59.999Z`)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

    return data
}

// A duplicate Stripe webhook delivery (or two settings-save requests firing close
// together) can call this with the same userId+week_number twice — upserting on that
// pair instead of a plain insert keeps a retry idempotent rather than creating a
// duplicate target row that downstream reads would pick almost-arbitrarily between.
const insertNutritionTarget = async (target: NutritionTargetInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase
        .from("nutrition_targets")
        .upsert(target, { onConflict: "user_id,week_number" })
    if (error) throw error
}

// Applied to every generated target, first calculation included — a low bodyweight
// combined with an aggressive fat_loss deficit can otherwise formula its way to a
// dangerously low number (e.g. ~700kcal/day) with nothing catching it before today's fix
// only guarded later trend-based adjustments.
const MIN_CALORIES_FLOOR = 1200

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
        calories: Math.max(result.calories, MIN_CALORIES_FLOOR),
        protein_g: result.proteinG,
        fat_g: result.fatG,
        carbs_g: result.carbsG,
        accounts_for_training: accountsForTraining,
    })
}

// Everything else in this file sets the target from a formula (bodyweight/goal/activity)
// — this is the only place that looks at whether the formula is actually WORKING and
// nudges it if not. Deliberately conservative: small steps, rate-limited to roughly once
// every two weeks, and only fires when the trend is clearly off (not reacting to normal
// day-to-day water-weight noise), so a bad single weigh-in can't swing the target.
const FAT_LOSS_MIN_WEEKLY_PCT = -0.15
const MUSCLE_GAIN_MIN_WEEKLY_PCT = 0.05
const MAINTENANCE_BAND_PCT = 0.3
const TREND_ADJUSTMENT_KCAL = 125
const MIN_DAYS_BETWEEN_TREND_ADJUSTMENTS = 13
const MIN_TREND_WINDOW_DAYS = 10

export const checkAndAdjustNutritionTargetForTrend = async (userId: string): Promise<void> => {
    const [profile, entitlements, history, latestTarget] = await Promise.all([
        getProfile(userId),
        getEntitlementsForUser(userId),
        getBodyLogHistory(userId),
        getLatestNutritionTarget(userId),
    ])

    const hasNutrition = entitlements.some(e => e.module === "nutrition" && e.status === "active")
    if (!hasNutrition || !latestTarget || !profile?.goal) return

    const daysSinceLastTarget = (Date.now() - new Date(latestTarget.created_at).getTime()) / 86_400_000
    if (daysSinceLastTarget < MIN_DAYS_BETWEEN_TREND_ADJUSTMENTS) return

    const windowStart = Date.now() - MIN_TREND_WINDOW_DAYS * 86_400_000
    const recent = history.filter(h => new Date(h.logged_at).getTime() >= windowStart)
    if (recent.length < 2) return

    const first = recent[0]
    const last = recent[recent.length - 1]
    const daysBetween = (new Date(last.logged_at).getTime() - new Date(first.logged_at).getTime()) / 86_400_000
    if (daysBetween < MIN_TREND_WINDOW_DAYS || first.weight_kg === 0) return

    const weeklyPct = (((last.weight_kg - first.weight_kg) / first.weight_kg) * 100) / (daysBetween / 7)

    const calorieDelta = profile.goal === "fat_loss" && weeklyPct > FAT_LOSS_MIN_WEEKLY_PCT
        ? -TREND_ADJUSTMENT_KCAL
        : profile.goal === "muscle_gain" && weeklyPct < MUSCLE_GAIN_MIN_WEEKLY_PCT
            ? TREND_ADJUSTMENT_KCAL
            : profile.goal === "maintenance" && Math.abs(weeklyPct) > MAINTENANCE_BAND_PCT
                ? (weeklyPct > 0 ? -TREND_ADJUSTMENT_KCAL : TREND_ADJUSTMENT_KCAL)
                : 0

    if (calorieDelta === 0) return

    const newCalories = Math.max(latestTarget.calories + calorieDelta, MIN_CALORIES_FLOOR)
    const carbsDeltaG = Math.round((newCalories - latestTarget.calories) / 4)

    await insertNutritionTarget({
        user_id: userId,
        week_number: latestTarget.week_number + 1,
        calories: newCalories,
        protein_g: latestTarget.protein_g,
        fat_g: latestTarget.fat_g,
        carbs_g: Math.max(latestTarget.carbs_g + carbsDeltaG, 0),
        accounts_for_training: latestTarget.accounts_for_training,
    })
}

// Training engine
//
// day_of_week follows ISO weekday numbering: 1 = Monday ... 7 = Sunday.
// Days with no rows in this template are rest days.
//
// A plan is generated fresh once per calendar week (week_number = ISO year*100+week).
// Exercise selection rotates week to week so the same slot doesn't always land on the
// same movement, while weight/reps carry over from the most recent week that exercise
// was last assigned — so switching exercises doesn't reset progression to zero.
// Shared by getOrCreateTrainingPlan (real, persisted generation) and
// getTrainingPlanPreviewForWeek (a read-only "what would next week look like" preview) —
// both need the full exercise pool and the user's most recent weight/reps per exercise
// so progression carries over instead of resetting to the experience-tier default.
const getExercisePool = async () => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("exercises")
        .select("id, name, muscle_group, equipment, description, how_to_perform, muscles_worked, tips, common_mistakes")

    if (error) throw error
    return data
}

const getTrainingPlanCountForUser = async (userId: string) => {
    const supabase = getServerClient()
    const { count, error } = await supabase
        .from("training_plans")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)

    if (error) throw error
    return count ?? 0
}

const getPreviousTargetsForUser = async (userId: string) => {
    const supabase = getServerClient()
    const { data: pastAssignments, error: pastError } = await supabase
        .from("plan_exercises")
        .select("exercise_id, target_weight_kg, target_reps, training_plans!inner(user_id, week_number)")
        .eq("training_plans.user_id", userId)

    if (pastError) throw pastError

    const previousTargets = new Map<number, PreviousTarget>()
    const latestWeekByExercise = new Map<number, number>()
    for (const row of pastAssignments) {
        const plan = Array.isArray(row.training_plans) ? row.training_plans[0] : row.training_plans
        const weekNumber = plan?.week_number ?? 0
        const latestSoFar = latestWeekByExercise.get(row.exercise_id)
        if (latestSoFar === undefined || weekNumber > latestSoFar) {
            latestWeekByExercise.set(row.exercise_id, weekNumber)
            previousTargets.set(row.exercise_id, { weightKg: row.target_weight_kg ?? 0, reps: row.target_reps })
        }
    }
    return previousTargets
}

// Returns isDeloadWeek alongside the plan id, computed/read from the exact same row the
// plan itself was generated from or already exists as — a caller that needs both must get
// them from this single call rather than a second, independent query. Reading is_deload
// via a separate query run in parallel with this one (Promise.all) used to race against
// the lazy INSERT below: on a brand-new week, the separate read would often complete
// before the plan (and its is_deload value) was actually written, silently reporting
// "not a deload" for a plan that, moments later, generated with deload-reduced sets and
// weight anyway — a real mismatch between what the UI's badge said and what the numbers
// on screen actually were.
export const getOrCreateTrainingPlan = async (userId: string): Promise<{ id: number, isDeloadWeek: boolean }> => {
    const supabase = getServerClient()
    const weekKey = getISOWeekKey(new Date())

    const { data: existing } = await supabase
        .from("training_plans")
        .select("id, is_deload")
        .eq("user_id", userId)
        .eq("week_number", weekKey)
        .maybeSingle()

    if (existing) return { id: existing.id, isDeloadWeek: existing.is_deload }

    const [profile, exerciseRows, previousTargets, bodyWeightKg, plansSoFar] = await Promise.all([
        getProfile(userId),
        getExercisePool(),
        getPreviousTargetsForUser(userId),
        getLatestBodyWeight(userId),
        getTrainingPlanCountForUser(userId),
    ])

    // Every 5th week of real training (not counting this brand-new one) is a deload —
    // counted by plans actually generated rather than calendar weeks, so a break in
    // training doesn't throw off the cadence. weekInBlock (1-4) is this plan's position
    // within the 4 training weeks leading up to that deload, driving a small accumulation
    // wave in generateTrainingPlan rather than flat volume every week until the cut.
    const isDeloadWeek = (plansSoFar + 1) % 5 === 0
    const weekInBlock = (plansSoFar % 5) + 1

    const generatedExercises = generateTrainingPlan(
        {
            experience: profile?.experience ?? null,
            daysPerWeek: profile?.days_per_week ?? null,
            equipment: profile?.equipment ?? null,
            gender: profile?.gender ?? null,
            bodyWeightKg,
            goal: profile?.goal ?? null,
        },
        exerciseRows,
        { rotationOffset: weekKey, previousTargets, isDeloadWeek, weekInBlock }
    )

    const { data: plan, error: planError } = await supabase
        .from("training_plans")
        .insert({ user_id: userId, week_number: weekKey, template_name: getSplitLabel(profile?.days_per_week ?? null), is_deload: isDeloadWeek })
        .select("id")
        .single()

    if (planError) {
        // 23505 = unique_violation on (user_id, week_number) — another request (a second
        // tab, or another page that also calls this) won the race and already created this
        // week's plan between our check above and this insert. Use its plan rather than
        // erroring out or creating a duplicate — the duplicate is exactly what used to slip
        // through here before the unique constraint existed, and it's what made the exercise
        // swap feature (and anything else keyed off a specific plan_exercise_id) flaky: the
        // UI could end up reading one duplicate plan while acting on another.
        if (planError.code === "23505") {
            const { data: winner, error: refetchError } = await supabase
                .from("training_plans")
                .select("id, is_deload")
                .eq("user_id", userId)
                .eq("week_number", weekKey)
                .single()
            if (refetchError) throw refetchError
            return { id: winner.id, isDeloadWeek: winner.is_deload }
        }
        throw planError
    }

    const planExercises = generatedExercises.map((item, index) => ({
        training_plan_id: plan.id,
        exercise_id: item.exerciseId,
        day_of_week: item.dayOfWeek,
        target_sets: item.sets,
        target_reps: item.reps,
        target_weight_kg: item.weightKg,
        order_index: index,
    }))

    const { error: insertError } = await supabase.from("plan_exercises").insert(planExercises)
    if (insertError) throw insertError

    return { id: plan.id, isDeloadWeek }
}

// Called after the user changes experience/daysPerWeek/equipment mid-week — without this,
// getOrCreateTrainingPlan would keep serving the plan already generated for the current
// ISO week and the new preferences wouldn't take effect until next Monday.
export const regenerateTrainingPlanForCurrentWeek = async (userId: string) => {
    const supabase = getServerClient()
    const weekKey = getISOWeekKey(new Date())

    const { data: existing } = await supabase
        .from("training_plans")
        .select("id")
        .eq("user_id", userId)
        .eq("week_number", weekKey)
        .maybeSingle()

    if (!existing) return

    await supabase.from("plan_exercises").delete().eq("training_plan_id", existing.id)
    await supabase.from("training_plans").delete().eq("id", existing.id)
}

export type TrainingPlanExercise = {
    planExerciseId: number
    exerciseId: number
    name: string
    muscleGroup: string
    description: string | null
    howToPerform: string | null
    musclesWorked: string | null
    tips: string | null
    commonMistakes: string | null
    sets: number
    reps: number
    weightKg: number | null
}

const getPlanExercisesByDay = async (planId: number) => {
    const supabase = getServerClient()

    const { data, error } = await supabase
        .from("plan_exercises")
        .select("id, exercise_id, day_of_week, target_sets, target_reps, target_weight_kg, order_index, exercises(name, muscle_group, description, how_to_perform, muscles_worked, tips, common_mistakes)")
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
            exerciseId: row.exercise_id,
            name: exercise.name,
            muscleGroup: exercise.muscle_group,
            description: exercise.description,
            howToPerform: exercise.how_to_perform,
            musclesWorked: exercise.muscles_worked,
            tips: exercise.tips,
            commonMistakes: exercise.common_mistakes,
            sets: row.target_sets,
            reps: row.target_reps,
            weightKg: row.target_weight_kg,
        })
        byDay.set(row.day_of_week, list)
    }

    return byDay
}

export type TrainingPlanWithMeta = { byDay: Map<number, TrainingPlanExercise[]>, isDeloadWeek: boolean }

export const getTrainingPlanWithExercises = async (userId: string): Promise<TrainingPlanWithMeta> => {
    const { id, isDeloadWeek } = await getOrCreateTrainingPlan(userId)
    const byDay = await getPlanExercisesByDay(id)
    return { byDay, isDeloadWeek }
}

// Lets a user swap out one exercise for another with the same muscle group + equipment,
// without waiting for the automatic weekly rotation. Only ever touches the CURRENT week's
// plan — a swap has no meaning for a past week (that's history) or the next-week preview
// (that's not persisted at all). previouslySwappedIds is the client's running history of
// exercise IDs already cycled through THIS visit (nothing is persisted server-side) — an
// empty pool after excluding those falls back to only excluding the current exercise, so
// a small pool (e.g. just 2 options) can still ping-pong rather than dead-end.
export const swapPlanExercise = async (userId: string, planExerciseId: number, previouslySwappedIds: number[] = []): Promise<number | null> => {
    const supabase = getServerClient()
    const weekKey = getISOWeekKey(new Date())

    const { data: row } = await supabase
        .from("plan_exercises")
        .select("id, exercise_id, day_of_week, training_plan_id, training_plans!inner(user_id, week_number, is_deload)")
        .eq("id", planExerciseId)
        .maybeSingle()

    if (!row) return null
    const plan = Array.isArray(row.training_plans) ? row.training_plans[0] : row.training_plans
    if (!plan || plan.user_id !== userId || plan.week_number !== weekKey) return null

    // The UI already hides the swap button once a set is logged, but that's client-side
    // only — without this, a request crafted directly against the API could swap the
    // exercise out from under sets already logged against this planExerciseId, leaving
    // those logs pointing at a different movement than what was actually performed.
    const { count: loggedSetCount } = await supabase
        .from("workout_set_logs")
        .select("id", { count: "exact", head: true })
        .eq("plan_exercise_id", planExerciseId)

    if (loggedSetCount && loggedSetCount > 0) return null

    const { data: currentExercise } = await supabase
        .from("exercises")
        .select("muscle_group, equipment")
        .eq("id", row.exercise_id)
        .maybeSingle()

    if (!currentExercise?.equipment) return null

    // Exclude both the current exercise and anything already scheduled elsewhere that same
    // day, so a swap can't accidentally create two identical exercises in one session.
    const { data: sameDayRows } = await supabase
        .from("plan_exercises")
        .select("exercise_id")
        .eq("training_plan_id", row.training_plan_id)
        .eq("day_of_week", row.day_of_week)

    const excludedIds = new Set((sameDayRows ?? []).map(r => r.exercise_id))

    const { data: alternatives } = await supabase
        .from("exercises")
        .select("id, name, muscle_group, equipment")
        .eq("muscle_group", currentExercise.muscle_group)
        .eq("equipment", currentExercise.equipment)

    const withoutHistory = (alternatives ?? []).filter(alt => !excludedIds.has(alt.id) && !previouslySwappedIds.includes(alt.id))
    const pool = withoutHistory.length > 0
        ? withoutHistory
        : (alternatives ?? []).filter(alt => !excludedIds.has(alt.id))
    if (pool.length === 0) return null

    const nextExercise = pool[Math.floor(Math.random() * pool.length)]

    // The old exercise_id-only update carried the PREVIOUS exercise's weight/reps straight
    // over to whatever got swapped in — harmless between two similar lifts, but nonsensical
    // (and on a heavy compound, not exactly safe) between something like an isolation curl
    // and a barbell row. Recompute the same way generateTrainingPlan would for this slot:
    // this exercise's own logged history first, else a fresh experience/body-stat-adjusted
    // starting weight, deload-adjusted if this week is one.
    const [profile, bodyWeightKg, previousTargets] = await Promise.all([
        getProfile(userId),
        getLatestBodyWeight(userId),
        getPreviousTargetsForUser(userId),
    ])

    const previous = previousTargets.get(nextExercise.id)
    const baseWeight = previous?.weightKg ?? getDefaultWeightForExercise({ ...nextExercise, equipment: nextExercise.equipment! }, {
        experience: profile?.experience ?? null,
        daysPerWeek: profile?.days_per_week ?? null,
        equipment: profile?.equipment ?? null,
        gender: profile?.gender ?? null,
        bodyWeightKg,
        goal: profile?.goal ?? null,
    })
    const newWeight = applyDeloadToWeight(baseWeight, nextExercise.equipment!, plan.is_deload)

    const { error } = await supabase
        .from("plan_exercises")
        .update({ exercise_id: nextExercise.id, target_weight_kg: newWeight, ...(previous ? { target_reps: previous.reps } : {}) })
        .eq("id", planExerciseId)

    if (error) throw error
    return nextExercise.id
}

// Read-only lookup for a specific past ISO week — unlike getTrainingPlanWithExercises,
// this never creates a plan. A past week the user never actually opened (e.g. before
// they signed up, or before a given training preference took effect) legitimately has
// no plan, and fabricating one after the fact would misrepresent history.
export const getTrainingPlanForWeek = async (userId: string, weekKey: number) => {
    const supabase = getServerClient()
    const { data: plan } = await supabase
        .from("training_plans")
        .select("id")
        .eq("user_id", userId)
        .eq("week_number", weekKey)
        .maybeSingle()

    if (!plan) return null

    return getPlanExercisesByDay(plan.id)
}

// A read-only, non-persisted preview of what next week's plan WOULD look like if it were
// generated right now — same rotation/progression logic as getOrCreateTrainingPlan, just
// never written to training_plans/plan_exercises. Nothing here can ever affect a past or
// current week: it's a pure computation over the live exercise pool + profile, thrown away
// once the response is sent. The real plan for that week is only ever created for real once
// that week actually becomes the current one.
export type TrainingPlanPreview = { byDay: Map<number, TrainingPlanExercise[]>, isDeloadWeek: boolean }

export const getTrainingPlanPreviewForWeek = async (userId: string, weekKey: number): Promise<TrainingPlanPreview> => {
    const [profile, exerciseRows, previousTargets, bodyWeightKg, plansSoFar] = await Promise.all([
        getProfile(userId),
        getExercisePool(),
        getPreviousTargetsForUser(userId),
        getLatestBodyWeight(userId),
        getTrainingPlanCountForUser(userId),
    ])

    const isDeloadWeek = (plansSoFar + 1) % 5 === 0
    const weekInBlock = (plansSoFar % 5) + 1

    const exerciseById = new Map(exerciseRows.map(row => [row.id, row]))

    const generatedExercises = generateTrainingPlan(
        {
            experience: profile?.experience ?? null,
            daysPerWeek: profile?.days_per_week ?? null,
            equipment: profile?.equipment ?? null,
            gender: profile?.gender ?? null,
            bodyWeightKg,
            goal: profile?.goal ?? null,
        },
        exerciseRows,
        { rotationOffset: weekKey, previousTargets, isDeloadWeek, weekInBlock }
    )

    const byDay = new Map<number, TrainingPlanExercise[]>()
    for (const item of generatedExercises) {
        const exercise = exerciseById.get(item.exerciseId)
        if (!exercise) continue

        const list = byDay.get(item.dayOfWeek) ?? []
        list.push({
            planExerciseId: -exercise.id,
            exerciseId: exercise.id,
            name: exercise.name,
            muscleGroup: exercise.muscle_group,
            description: exercise.description,
            howToPerform: exercise.how_to_perform,
            musclesWorked: exercise.muscles_worked,
            tips: exercise.tips,
            commonMistakes: exercise.common_mistakes,
            sets: item.sets,
            reps: item.reps,
            weightKg: item.weightKg,
        })
        byDay.set(item.dayOfWeek, list)
    }

    return { byDay, isDeloadWeek }
}

export const getWorkoutLogsForDate = async (userId: string, date: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("workout_set_logs")
        .select("id, plan_exercise_id, set_number, actual_reps, actual_weight_kg, effort")
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

export const deleteWorkoutSetLog = async (userId: string, logId: number) => {
    const supabase = getServerClient()
    const { error } = await supabase
        .from("workout_set_logs")
        .delete()
        .eq("id", logId)
        .eq("user_id", userId)

    if (error) throw error
}

export const getPlanExerciseForProgression = async (planExerciseId: number) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("plan_exercises")
        .select("id, target_sets, target_reps, target_weight_kg, exercises(equipment)")
        .eq("id", planExerciseId)
        .single()

    if (error) throw error

    const exercise = Array.isArray(data.exercises) ? data.exercises[0] : data.exercises

    return {
        targetSets: data.target_sets,
        targetReps: data.target_reps,
        targetWeightKg: data.target_weight_kg ?? 0,
        equipment: exercise?.equipment ?? null,
    }
}

export const getTodaysEffortsForPlanExercise = async (userId: string, planExerciseId: number, date: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("workout_set_logs")
        .select("effort")
        .eq("user_id", userId)
        .eq("plan_exercise_id", planExerciseId)
        .gte("performed_at", `${date}T00:00:00.000Z`)
        .lt("performed_at", `${date}T23:59:59.999Z`)

    if (error) throw error
    return data.map(row => row.effort)
}

export const updatePlanExerciseTargets = async (planExerciseId: number, targets: { weightKg: number, reps: number }) => {
    const supabase = getServerClient()
    const { error } = await supabase
        .from("plan_exercises")
        .update({ target_weight_kg: targets.weightKg, target_reps: targets.reps })
        .eq("id", planExerciseId)

    if (error) throw error
}

export type WorkoutHistoryRow = {
    logId: number
    performedAt: string
    exerciseName: string
    actualReps: number
    actualWeightKg: number
}

export const getWorkoutHistory = async (userId: string): Promise<WorkoutHistoryRow[]> => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("workout_set_logs")
        .select("id, performed_at, actual_reps, actual_weight_kg, plan_exercises(exercises(name))")
        .eq("user_id", userId)
        .order("performed_at", { ascending: true })

    if (error) throw error

    return data.map(row => {
        const planExercise = Array.isArray(row.plan_exercises) ? row.plan_exercises[0] : row.plan_exercises
        const exercise = planExercise ? (Array.isArray(planExercise.exercises) ? planExercise.exercises[0] : planExercise.exercises) : null

        return {
            logId: row.id,
            performedAt: row.performed_at,
            exerciseName: exercise?.name ?? "Exercise",
            actualReps: row.actual_reps,
            actualWeightKg: row.actual_weight_kg,
        }
    })
}

// GDPR right-to-access — deleteUserAccount covers right-to-erasure, but until now there
// was no way for a user to get a copy of their own data first. Pulls straight from the
// same tables deleteUserAccount wipes, so the two stay in sync by construction. Progress
// photos are included as short-lived signed URLs rather than embedded bytes, so a request
// for this doesn't have to shuttle megabytes of images through a JSON response.
export const getUserDataExport = async (userId: string) => {
    const supabase = getServerClient()

    const [profile, entitlements, bodyLogs, measurements, nutritionTargets, intake, workoutHistory, photos] = await Promise.all([
        getProfile(userId),
        getEntitlementsForUser(userId),
        getBodyLogHistory(userId),
        getBodyMeasurementHistory(userId),
        supabase.from("nutrition_targets").select("week_number, calories, protein_g, fat_g, carbs_g, accounts_for_training, created_at").eq("user_id", userId).order("week_number", { ascending: true }).then(r => {
            if (r.error) throw r.error
            return r.data
        }),
        getIntakeHistory(userId),
        getWorkoutHistory(userId),
        getProgressPhotosForUser(userId),
    ])

    const photoStorage = supabase.storage.from("progress-photos")
    const photosWithUrls = await Promise.all(photos.map(async photo => {
        const { data } = await photoStorage.createSignedUrl(photo.storage_path, 60 * 10)
        return { label: photo.label, takenAt: photo.taken_at, url: data?.signedUrl ?? null }
    }))

    return {
        exportedAt: new Date().toISOString(),
        profile,
        entitlements,
        bodyWeightLogs: bodyLogs,
        bodyMeasurements: measurements,
        nutritionTargets,
        mealLog: intake,
        workoutHistory,
        progressPhotos: photosWithUrls,
    }
}

// Recipes are cached from Spoonacular — this upsert is only ever called from the
// manually-triggered sync route, never on a normal request, so it's the one write path
// into a table every other reader only ever selects from.
export const upsertRecipe = async (recipe: RecipeInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("recipes").upsert(recipe, { onConflict: "external_id" })
    if (error) throw error
}

export type RecipeSort = "title" | "calories_asc" | "calories_desc" | "protein_desc" | "newest"

export type RecipeFilters = {
    search?: string
    minProtein?: number
    maxCalories?: number
    sort?: RecipeSort
    page?: number
}

const RECIPE_SORT_COLUMNS: Record<RecipeSort, { column: string, ascending: boolean }> = {
    title: { column: "title", ascending: true },
    calories_asc: { column: "calories", ascending: true },
    calories_desc: { column: "calories", ascending: false },
    protein_desc: { column: "protein_g", ascending: false },
    newest: { column: "created_at", ascending: false },
}

export const RECIPES_PAGE_SIZE = 24

export const getRecipes = async (filters: RecipeFilters = {}) => {
    const supabase = getServerClient()
    let query = supabase
        .from("recipes")
        .select("id, title, image_url, calories, protein_g, fat_g, carbs_g, servings", { count: "exact" })

    if (filters.search) query = query.ilike("title", `%${filters.search}%`)
    if (filters.minProtein) query = query.gte("protein_g", filters.minProtein)
    if (filters.maxCalories) query = query.lte("calories", filters.maxCalories)

    const { column, ascending } = RECIPE_SORT_COLUMNS[filters.sort ?? "title"]
    query = query.order(column, { ascending })

    const page = filters.page && filters.page > 0 ? filters.page : 1
    const from = (page - 1) * RECIPES_PAGE_SIZE
    query = query.range(from, from + RECIPES_PAGE_SIZE - 1)

    const { data, error, count } = await query
    if (error) throw error
    return { recipes: data, totalCount: count ?? 0 }
}

export const getRecipeById = async (id: number) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .maybeSingle()

    if (error) throw error
    return data
}

// Recipes saved before fillIngredients=true was added to the search call — used by the
// backfill route so it only ever spends quota on the ones that actually need it.
export const getRecipesMissingIngredients = async (limit: number) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("recipes")
        .select("id, external_id")
        .eq("ingredients", "")
        .limit(limit)

    if (error) throw error
    return data
}

export const updateRecipeIngredients = async (id: number, ingredients: string) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("recipes").update({ ingredients }).eq("id", id)
    if (error) throw error
}

