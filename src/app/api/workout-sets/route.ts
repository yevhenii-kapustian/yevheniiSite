import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import {
    getPlanExerciseForProgression,
    getTodaysEffortsForPlanExercise,
    insertWorkoutSetLog,
    updatePlanExerciseTargets,
    deleteWorkoutSetLog,
    getEntitlementsForUser,
} from "@/supabase/queries";
import { computeProgression, type Effort } from "@/utils/progression";
import { hasActiveModule } from "@/utils/entitlements";
import { parseJsonBody } from "@/lib/parseJsonBody";
import { getTodayLocalDate } from "@/utils/date";

const VALID_EFFORTS = ["easy", "moderate", "hard", "failed"]

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const entitlements = await getEntitlementsForUser(user.id)
    if (!hasActiveModule(entitlements, "training")) {
        return NextResponse.json({ message: "Training module required" }, { status: 403 })
    }

    const { data: body, error: parseError } = await parseJsonBody(req)
    if (parseError) return parseError
    const { planExerciseId, setNumber, actualReps, actualWeightKg, effort } = body

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
    const today = getTodayLocalDate()
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

export async function DELETE(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const entitlements = await getEntitlementsForUser(user.id)
    if (!hasActiveModule(entitlements, "training")) {
        return NextResponse.json({ message: "Training module required" }, { status: 403 })
    }

    const { data: body, error: parseError } = await parseJsonBody<{ logId?: unknown }>(req)
    if (parseError) return parseError
    const logIdNum = Number(body.logId)
    if (!Number.isInteger(logIdNum) || logIdNum <= 0) {
        return NextResponse.json({ message: "Invalid logId" }, { status: 400 })
    }

    await deleteWorkoutSetLog(user.id, logIdNum)

    return NextResponse.json({ message: "Success" })
}
