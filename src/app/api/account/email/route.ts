import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function PATCH(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { email } = await req.json()
    if (typeof email !== "string" || !EMAIL_RE.test(email)) {
        return NextResponse.json({ message: "Invalid email" }, { status: 400 })
    }

    // Supabase sends a confirmation link to the new address — the change only
    // takes effect once the user clicks it, so no extra verification code here.
    const { error } = await supabase.auth.updateUser({ email })
    if (error) {
        return NextResponse.json({ message: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Confirmation email sent" })
}
