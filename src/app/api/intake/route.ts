import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { insertMeal, deleteMeal, getEntitlementsForUser } from "@/supabase/queries";
import { hasActiveModule } from "@/utils/entitlements";
import { parseJsonBody } from "@/lib/parseJsonBody";
import { getTodayLocalDate } from "@/utils/date";

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Page-level redirects gate the UI, but nothing stopped a request made straight
    // against this endpoint from logging meals without an active nutrition subscription.
    const entitlements = await getEntitlementsForUser(user.id)
    if (!hasActiveModule(entitlements, "nutrition")) {
        return NextResponse.json({ message: "Nutrition module required" }, { status: 403 })
    }

    const { data: body, error: parseError } = await parseJsonBody(req)
    if (parseError) return parseError
    const { mealType, name, calories, proteinG, fatG, carbsG } = body

    const caloriesNum = Number(calories)
    if (!Number.isFinite(caloriesNum) || caloriesNum <= 0 || caloriesNum > 20000) {
        return NextResponse.json({ message: "Invalid calories" }, { status: 400 })
    }

    for (const [field, value] of [["proteinG", proteinG], ["fatG", fatG], ["carbsG", carbsG]] as const) {
        if (value !== undefined && value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
            return NextResponse.json({ message: `Invalid ${field}` }, { status: 400 })
        }
    }

    // protein_g/fat_g/carbs_g are whole-number (int) columns — rounding here too, not just
    // on the client, so any decimal value (from this or a future caller) can never reach an
    // insert that Postgres would silently-to-the-caller reject as a type mismatch.
    await insertMeal({
        user_id: user.id,
        logged_date: getTodayLocalDate(),
        meal_type: mealType || null,
        name: name || null,
        calories: Math.round(caloriesNum),
        protein_g: proteinG ? Math.round(Number(proteinG)) : null,
        fat_g: fatG ? Math.round(Number(fatG)) : null,
        carbs_g: carbsG ? Math.round(Number(carbsG)) : null,
    })

    return NextResponse.json({ message: "Success" })
}

export async function DELETE(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const entitlements = await getEntitlementsForUser(user.id)
    if (!hasActiveModule(entitlements, "nutrition")) {
        return NextResponse.json({ message: "Nutrition module required" }, { status: 403 })
    }

    const { data: body, error: parseError } = await parseJsonBody<{ mealId?: unknown }>(req)
    if (parseError) return parseError
    const mealIdNum = Number(body.mealId)
    if (!Number.isInteger(mealIdNum) || mealIdNum <= 0) {
        return NextResponse.json({ message: "Invalid mealId" }, { status: 400 })
    }

    await deleteMeal(user.id, mealIdNum)

    return NextResponse.json({ message: "Success" })
}
