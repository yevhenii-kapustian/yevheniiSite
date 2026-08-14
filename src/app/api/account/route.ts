import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { deleteUserAccount } from "@/supabase/queries";

export async function DELETE(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { confirm } = await req.json()
    if (confirm !== "DELETE") {
        return NextResponse.json({ message: "Confirmation text did not match" }, { status: 400 })
    }

    await deleteUserAccount(user.id)

    try {
        await supabase.auth.signOut()
    } catch {
        // Account is already gone — clearing the local session is best-effort.
    }

    return NextResponse.json({ message: "Success" })
}
