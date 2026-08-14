import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { insertMeal, deleteMeal } from "@/supabase/queries";

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { mealType, name, calories, proteinG, fatG, carbsG } = await req.json()

    const caloriesNum = Number(calories)
    if (!Number.isFinite(caloriesNum) || caloriesNum <= 0 || caloriesNum > 20000) {
        return NextResponse.json({ message: "Invalid calories" }, { status: 400 })
    }

    for (const [field, value] of [["proteinG", proteinG], ["fatG", fatG], ["carbsG", carbsG]] as const) {
        if (value !== undefined && value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 0)) {
            return NextResponse.json({ message: `Invalid ${field}` }, { status: 400 })
        }
    }

    await insertMeal({
        user_id: user.id,
        logged_date: new Date().toISOString().slice(0, 10),
        meal_type: mealType || null,
        name: name || null,
        calories: caloriesNum,
        protein_g: proteinG ? Number(proteinG) : null,
        fat_g: fatG ? Number(fatG) : null,
        carbs_g: carbsG ? Number(carbsG) : null,
    })

    return NextResponse.json({ message: "Success" })
}

export async function DELETE(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { mealId } = await req.json()
    const mealIdNum = Number(mealId)
    if (!Number.isInteger(mealIdNum) || mealIdNum <= 0) {
        return NextResponse.json({ message: "Invalid mealId" }, { status: 400 })
    }

    await deleteMeal(user.id, mealIdNum)

    return NextResponse.json({ message: "Success" })
}
