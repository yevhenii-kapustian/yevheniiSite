import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { swapPlanExercise, getEntitlementsForUser } from "@/supabase/queries";
import { hasActiveModule } from "@/utils/entitlements";

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

    let body: { planExerciseId?: unknown, previouslySwappedIds?: unknown }
    try {
        body = await req.json()
    } catch {
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }

    const planExerciseIdNum = Number(body.planExerciseId)
    if (!Number.isInteger(planExerciseIdNum) || planExerciseIdNum <= 0) {
        return NextResponse.json({ message: "Invalid planExerciseId" }, { status: 400 })
    }

    const previouslySwappedIds = Array.isArray(body.previouslySwappedIds)
        ? body.previouslySwappedIds.filter((id): id is number => Number.isInteger(id))
        : []

    const newExerciseId = await swapPlanExercise(user.id, planExerciseIdNum, previouslySwappedIds)

    if (newExerciseId === null) {
        return NextResponse.json({ message: "No alternative exercise available" }, { status: 409 })
    }

    return NextResponse.json({ message: "Success", newExerciseId })
}
