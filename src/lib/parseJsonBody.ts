import { NextRequest, NextResponse } from "next/server"

// req.json() throws on a malformed/empty body, which Next.js otherwise turns into an
// unhandled 500 — every mutating API route wants a plain 400 there instead, so this is
// shared rather than re-wrapped in a try/catch in each route.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseJsonBody = async <T = any>(
    req: NextRequest
): Promise<{ data: T, error?: undefined } | { data?: undefined, error: NextResponse }> => {
    try {
        return { data: await req.json() as T }
    } catch {
        return { error: NextResponse.json({ message: "Invalid request body" }, { status: 400 }) }
    }
}
