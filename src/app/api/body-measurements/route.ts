import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { insertBodyMeasurement, deleteBodyMeasurement } from "@/supabase/queries";
import { parseJsonBody } from "@/lib/parseJsonBody";
import { getTodayLocalDate } from "@/utils/date";

const parseOptionalNumber = (value: unknown): number | null => {
    if (value === null || value === undefined || value === "") return null
    const num = Number(value)
    return Number.isFinite(num) && num > 0 ? num : null
}

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data: body, error: parseError } = await parseJsonBody(req)
    if (parseError) return parseError
    const { waist, chest, hips, thigh, arm } = body

    const waistCm = parseOptionalNumber(waist)
    const chestCm = parseOptionalNumber(chest)
    const hipsCm = parseOptionalNumber(hips)
    const thighCm = parseOptionalNumber(thigh)
    const armCm = parseOptionalNumber(arm)

    if (!waistCm && !chestCm && !hipsCm && !thighCm && !armCm) {
        return NextResponse.json({ message: "At least one measurement is required" }, { status: 400 })
    }

    await insertBodyMeasurement({
        user_id: user.id,
        logged_at: getTodayLocalDate(),
        waist_cm: waistCm,
        chest_cm: chestCm,
        hips_cm: hipsCm,
        thigh_cm: thighCm,
        arm_cm: armCm,
    })

    return NextResponse.json({ message: "Success" })
}

export async function DELETE(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data: body, error: parseError } = await parseJsonBody<{ id?: unknown }>(req)
    if (parseError) return parseError
    const idNum = Number(body.id)
    if (!Number.isInteger(idNum) || idNum <= 0) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 })
    }

    await deleteBodyMeasurement(user.id, idNum)

    return NextResponse.json({ message: "Success" })
}
