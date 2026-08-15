import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { upsertProfile, insertBodyLog, regenerateTrainingPlanForCurrentWeek, recalculateNutritionTargetIfActive } from "@/supabase/queries";

const VALID_GENDERS = ["male", "female"]
const VALID_GOALS = ["fat_loss", "maintenance", "muscle_gain"]
const VALID_ACTIVITY_LEVEL = ["Mostly sitting", "On my feet a lot", "Physically demanding job"]
const VALID_EXPERIENCE = ["New to training", "Some experience", "Advanced"]
const VALID_DAYS_PER_WEEK = ["2-3", "4", "5+"]
const VALID_EQUIPMENT = ["Full gym", "Home basics", "Bodyweight only"]

// Used after an already-logged-in user buys the bundle from inside /my-profile (no quiz
// metadata collected at checkout, unlike the anonymous /get-started flow) — collects the
// same answers via the setup quiz and saves them in one shot.
export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { gender, age, height, weight, goal, activityLevel, experience, daysPerWeek, equipment } = await req.json()

    const ageNum = Number(age)
    const heightNum = Number(height)
    const weightNum = Number(weight)

    if (
        !VALID_GENDERS.includes(gender)
        || !VALID_GOALS.includes(goal)
        || !Number.isFinite(ageNum) || ageNum < 13 || ageNum > 100
        || !Number.isFinite(heightNum) || heightNum < 100 || heightNum > 250
        || !Number.isFinite(weightNum) || weightNum < 30 || weightNum > 300
        || !VALID_ACTIVITY_LEVEL.includes(activityLevel)
        || !VALID_EXPERIENCE.includes(experience)
        || !VALID_DAYS_PER_WEEK.includes(daysPerWeek)
        || !VALID_EQUIPMENT.includes(equipment)
    ) {
        return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 })
    }

    await upsertProfile({
        id: user.id,
        gender,
        age: ageNum,
        height_cm: heightNum,
        goal,
        activity_level: activityLevel,
        experience,
        days_per_week: daysPerWeek,
        equipment,
    })

    await insertBodyLog({
        user_id: user.id,
        logged_at: new Date().toISOString().slice(0, 10),
        weight_kg: weightNum,
    })

    await regenerateTrainingPlanForCurrentWeek(user.id)
    await recalculateNutritionTargetIfActive(user.id)

    return NextResponse.json({ message: "Success" })
}
