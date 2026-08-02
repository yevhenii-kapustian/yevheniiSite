import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { insertMeal } from "@/supabase/queries";

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { mealType, name, calories, proteinG, fatG, carbsG } = await req.json()

    if (!calories) {
        return NextResponse.json({ message: "Missing calories" }, { status: 400 })
    }

    await insertMeal({
        user_id: user.id,
        logged_date: new Date().toISOString().slice(0, 10),
        meal_type: mealType || null,
        name: name || null,
        calories: Number(calories),
        protein_g: proteinG ? Number(proteinG) : null,
        fat_g: fatG ? Number(fatG) : null,
        carbs_g: carbsG ? Number(carbsG) : null,
    })

    return NextResponse.json({ message: "Success" })
}
