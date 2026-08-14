import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { upsertProfile, recalculateNutritionTargetIfActive, regenerateTrainingPlanForCurrentWeek } from "@/supabase/queries";

const VALID_EXPERIENCE = ["New to training", "Some experience", "Advanced"]
const VALID_DAYS_PER_WEEK = ["2-3", "4", "5+"]
const VALID_EQUIPMENT = ["Full gym", "Home basics", "Bodyweight only"]
const VALID_ACTIVITY_LEVEL = ["Mostly sitting", "On my feet a lot", "Physically demanding job"]

export async function PATCH(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { trainsWithProgram, experience, daysPerWeek, equipment, activityLevel } = await req.json()

    const update: { id: string, trains_with_program?: boolean, experience?: string, days_per_week?: string, equipment?: string, activity_level?: string } = { id: user.id }

    if (trainsWithProgram !== undefined) {
        update.trains_with_program = Boolean(trainsWithProgram)
    }

    let trainingPrefsChanged = false
    if (experience !== undefined) {
        if (!VALID_EXPERIENCE.includes(experience)) return NextResponse.json({ message: "Invalid experience" }, { status: 400 })
        update.experience = experience
        trainingPrefsChanged = true
    }
    if (daysPerWeek !== undefined) {
        if (!VALID_DAYS_PER_WEEK.includes(daysPerWeek)) return NextResponse.json({ message: "Invalid daysPerWeek" }, { status: 400 })
        update.days_per_week = daysPerWeek
        trainingPrefsChanged = true
    }
    if (equipment !== undefined) {
        if (!VALID_EQUIPMENT.includes(equipment)) return NextResponse.json({ message: "Invalid equipment" }, { status: 400 })
        update.equipment = equipment
        trainingPrefsChanged = true
    }
    if (activityLevel !== undefined) {
        if (!VALID_ACTIVITY_LEVEL.includes(activityLevel)) return NextResponse.json({ message: "Invalid activityLevel" }, { status: 400 })
        update.activity_level = activityLevel
    }

    await upsertProfile(update)
    if (trainingPrefsChanged) await regenerateTrainingPlanForCurrentWeek(user.id)
    await recalculateNutritionTargetIfActive(user.id)

    return NextResponse.json({ message: "Success" })
}
