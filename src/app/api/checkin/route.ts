import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { upsertProfile, insertBodyLog, recalculateNutritionTargetIfActive } from "@/supabase/queries";

const VALID_GENDERS = ["male", "female"]
const VALID_GOALS = ["fat_loss", "maintenance", "muscle_gain"]

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { gender, age, height, weight, goal } = await req.json()

    const ageNum = Number(age)
    const heightNum = Number(height)
    const weightNum = Number(weight)

    if (
        !VALID_GENDERS.includes(gender)
        || !VALID_GOALS.includes(goal)
        || !Number.isFinite(ageNum) || ageNum < 13 || ageNum > 100
        || !Number.isFinite(heightNum) || heightNum < 100 || heightNum > 250
        || !Number.isFinite(weightNum) || weightNum < 30 || weightNum > 300
    ) {
        return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 })
    }

    await upsertProfile({
        id: user.id,
        gender,
        age: ageNum,
        height_cm: heightNum,
        goal,
    })

    await insertBodyLog({
        user_id: user.id,
        logged_at: new Date().toISOString().slice(0, 10),
        weight_kg: weightNum,
    })

    await recalculateNutritionTargetIfActive(user.id)

    return NextResponse.json({ message: "Success" })
}
