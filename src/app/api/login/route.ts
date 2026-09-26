import { NextRequest, NextResponse } from "next/server";
import { sendLoginLink } from "@/supabase/queries";
import { sendMagicLinkEmail } from "@/lib/email";
import { parseJsonBody } from "@/lib/parseJsonBody";

export async function POST(req: NextRequest) {
    const { data: body, error: parseError } = await parseJsonBody<{ email?: unknown }>(req)
    if (parseError) return parseError
    const { email } = body
    if (!email || typeof email !== "string") {
        return NextResponse.json({ message: "Missing email" }, { status: 400 })
    }

    const origin = req.nextUrl.origin
    const result = await sendLoginLink(email, `${origin}/welcome`)

    if (result) {
        await sendMagicLinkEmail(email, result.properties.action_link)
    }

    // Always respond the same way, whether or not the email has an account —
    // don't let this endpoint be used to check which emails are registered.
    return NextResponse.json({ message: "Success" })
}
