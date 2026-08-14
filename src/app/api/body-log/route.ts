import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { deleteBodyLog } from "@/supabase/queries";

export async function DELETE(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { loggedAt } = await req.json()
    if (typeof loggedAt !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(loggedAt)) {
        return NextResponse.json({ message: "Invalid loggedAt" }, { status: 400 })
    }

    await deleteBodyLog(user.id, loggedAt)

    return NextResponse.json({ message: "Success" })
}
