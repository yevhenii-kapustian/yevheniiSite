import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { upsertProfile, recalculateNutritionTargetIfActive } from "@/supabase/queries";

export async function PATCH(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { trainsWithProgram } = await req.json()

    await upsertProfile({ id: user.id, trains_with_program: Boolean(trainsWithProgram) })
    await recalculateNutritionTargetIfActive(user.id)

    return NextResponse.json({ message: "Success" })
}
