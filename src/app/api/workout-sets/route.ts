import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { insertWorkoutSetLog } from "@/supabase/queries";

const VALID_EFFORTS = ["easy", "moderate", "hard", "failed"]

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { planExerciseId, setNumber, actualReps, actualWeightKg, effort } = await req.json()

    if (!planExerciseId || !setNumber || !actualReps || !actualWeightKg || !VALID_EFFORTS.includes(effort)) {
        return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 })
    }

    await insertWorkoutSetLog({
        user_id: user.id,
        plan_exercise_id: Number(planExerciseId),
        set_number: Number(setNumber),
        actual_reps: Number(actualReps),
        actual_weight_kg: Number(actualWeightKg),
        effort,
    })

    return NextResponse.json({ message: "Success" })
}
