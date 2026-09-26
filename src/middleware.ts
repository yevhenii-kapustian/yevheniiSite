import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { authLimiter, writeLimiter, readLimiter, checkRateLimit } from "@/lib/rateLimit"

function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for")
    if (forwardedFor) return forwardedFor.split(",")[0].trim()
    return request.headers.get("x-real-ip") ?? "unknown"
}

function tooManyRequests(reset: number) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    return NextResponse.json(
        { message: "Too many requests. Please try again shortly." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Stripe's webhook calls are authenticated by signature in the route itself — rate
    // limiting them risks silently dropping a payment-fulfillment event on a retry burst.
    if (pathname.startsWith("/api") && !pathname.startsWith("/api/webhooks")) {
        const limiter =
            pathname === "/api/login"
                ? authLimiter
                : request.method === "GET"
                    ? readLimiter
                    : writeLimiter

        const { success, reset } = await checkRateLimit(limiter, getClientIp(request))
        if (!success) {
            return tooManyRequests(reset)
        }
    }

    let response = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && (request.nextUrl.pathname.startsWith("/my-profile") || request.nextUrl.pathname.startsWith("/setup"))) {
        return NextResponse.redirect(new URL("/get-started", request.url))
    }

    if (user && request.nextUrl.pathname.startsWith("/get-started")) {
        return NextResponse.redirect(new URL("/my-profile", request.url))
    }

    // /admin isn't linked from anywhere and its API routes already require ADMIN_SYNC_SECRET,
    // but that secret alone means "whoever has the string" — this adds a second, independent
    // gate at the middleware level: even with the right secret, the request also has to be
    // coming from a browser logged in as this specific account. Covers both the page (so it
    // 404s for anyone else before the form even renders) and its API routes (browser fetch()
    // calls from that page carry the session cookie automatically, so this doesn't break the
    // normal flow — it would only block a bare curl call made without that cookie).
    if (request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/admin")) {
        const adminEmail = process.env.ADMIN_EMAIL
        if (!adminEmail || !user || user.email !== adminEmail) {
            return NextResponse.rewrite(new URL("/404", request.url))
        }
    }

    return response
}

export const config = {
    matcher: ["/my-profile/:path*", "/get-started", "/setup", "/admin/:path*", "/api/:path*"],
}
