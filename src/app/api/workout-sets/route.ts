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

    const planExerciseIdNum = Number(planExerciseId)
    const setNumberNum = Number(setNumber)
    const actualRepsNum = Number(actualReps)
    const actualWeightKgNum = Number(actualWeightKg)

    if (
        planExerciseId == null || setNumber == null || actualReps == null || actualWeightKg == null
        || !Number.isInteger(planExerciseIdNum) || planExerciseIdNum <= 0
        || !Number.isInteger(setNumberNum) || setNumberNum <= 0
        || !Number.isFinite(actualRepsNum) || actualRepsNum < 0
        || !Number.isFinite(actualWeightKgNum) || actualWeightKgNum < 0
        || !VALID_EFFORTS.includes(effort)
    ) {
        return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 })
    }

    await insertWorkoutSetLog({
        user_id: user.id,
        plan_exercise_id: planExerciseIdNum,
        set_number: setNumberNum,
        actual_reps: actualRepsNum,
        actual_weight_kg: actualWeightKgNum,
        effort,
    })

    // Once every set for this exercise is logged for the day, use the effort ratings
    // to progress (or hold, or deload) the target for next time — otherwise the plan
    // would target the exact same weight/reps forever.
    const today = new Date().toISOString().slice(0, 10)
    const planExercise = await getPlanExerciseForProgression(planExerciseIdNum)
    const todaysEfforts = await getTodaysEffortsForPlanExercise(user.id, planExerciseIdNum, today)

    if (todaysEfforts.length === planExercise.targetSets) {
        const next = computeProgression(
            todaysEfforts as Effort[],
            { weightKg: planExercise.targetWeightKg, reps: planExercise.targetReps },
            planExercise.equipment
        )

        if (next.weightKg !== planExercise.targetWeightKg || next.reps !== planExercise.targetReps) {
            await updatePlanExerciseTargets(planExerciseIdNum, next)
        }
    }

    return NextResponse.json({ message: "Success" })
}
