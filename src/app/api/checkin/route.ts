import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { upsertProfile, insertBodyLog, recalculateNutritionTargetIfActive } from "@/supabase/queries";

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { gender, age, height, weight, goal } = await req.json()

    await upsertProfile({
        id: user.id,
        gender: String(gender),
        age: Number(age),
        height_cm: Number(height),
        goal: String(goal),
    })

    await insertBodyLog({
        user_id: user.id,
        logged_at: new Date().toISOString().slice(0, 10),
        weight_kg: Number(weight),
    })

    await recalculateNutritionTargetIfActive(user.id)

    return NextResponse.json({ message: "Success" })
}
