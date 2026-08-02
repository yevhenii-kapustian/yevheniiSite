import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import {
    getPlanExerciseForProgression,
    getTodaysEffortsForPlanExercise,
    insertWorkoutSetLog,
    updatePlanExerciseTargets,
} from "@/supabase/queries";
import { computeProgression, type Effort } from "@/utils/progression";

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

    // Once every set for this exercise is logged for the day, use the effort ratings
    // to progress (or hold, or deload) the target for next time — otherwise the plan
    // would target the exact same weight/reps forever.
    const today = new Date().toISOString().slice(0, 10)
    const planExercise = await getPlanExerciseForProgression(Number(planExerciseId))
    const todaysEfforts = await getTodaysEffortsForPlanExercise(user.id, Number(planExerciseId), today)

    if (todaysEfforts.length === planExercise.targetSets) {
        const next = computeProgression(
            todaysEfforts as Effort[],
            { weightKg: planExercise.targetWeightKg, reps: planExercise.targetReps },
            planExercise.equipment
        )

        if (next.weightKg !== planExercise.targetWeightKg || next.reps !== planExercise.targetReps) {
            await updatePlanExerciseTargets(Number(planExerciseId), next)
        }
    }

    return NextResponse.json({ message: "Success" })
}
