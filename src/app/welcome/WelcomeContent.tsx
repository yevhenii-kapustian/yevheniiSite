'use client'

import { useEffect, useState } from "react"
import { CheckCircle, WarningCircle } from "@phosphor-icons/react"
import { getBrowserClient } from "@/supabase/browser-client"

// Hard navigation on purpose: a client-side router.push/replace can serve /my-profile from
// Next's Router Cache (prefetched by the header nav before the webhook granted the
// entitlement), showing a stale "no access yet" state.
const goToProfile = () => { window.location.href = "/my-profile" }

const WelcomeContent = () => {
    const [status, setStatus] = useState<"working" | "no-link" | "expired">("working")

    useEffect(() => {
        // detectSessionInUrl is off (see browser-client.ts) — parse and exchange whatever's
        // in the URL ourselves. Two different shapes land here depending on the source:
        //  - Magic links (server-generated in the Stripe webhook, no verifier possible)
        //    come back as #access_token=... in the hash — handled via setSession().
        //  - Google login (signInWithOAuth, initiated in THIS browser, so it does have a
        //    verifier) comes back as ?code=... in the query — handled via exchangeCodeForSession().
        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const code = new URLSearchParams(window.location.search).get("code")

        const supabase = getBrowserClient()

        if (!accessToken && !code) {
            // No token of either kind in the URL — either this is an already-logged-in user
            // who just bought an extra module from /my-profile (no email needed, send
            // them straight back in) or a brand-new signup waiting on their inbox.
            supabase.auth.getUser().then(({ data }) => {
                if (data.user) {
                    goToProfile()
                } else {
                    setStatus("no-link")
                }
            })
            return
        }

        // Strip the tokens out of the address bar/history immediately — we've already
        // captured what we need, no reason for the live credentials to keep sitting there.
        window.history.replaceState(null, "", window.location.pathname)

        let cancelled = false
        const exchange = accessToken && refreshToken
            ? supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
            : supabase.auth.exchangeCodeForSession(code!)

        exchange.then(({ data, error }) => {
            if (cancelled) return
            if (data.session && !error) {
                goToProfile()
            } else {
                setStatus("expired")
            }
        })

        return () => { cancelled = true }
    }, [])

    if (status === "working") {
        return (
            <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 py-24 text-center">
                <p className="text-sm text-ink-strong/60">Signing you in…</p>
            </section>
        )
    }

    if (status === "expired") {
        return (
            <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 py-24 text-center">
                <WarningCircle size={40} weight="fill" className="text-ink-strong" />
                <h1 className="text-xl sm:text-2xl font-semibold text-ink-strong">That link expired</h1>
                <p className="max-w-sm text-sm sm:text-base text-ink-strong/60">
                    Sign-in links only work once. Reach out and we&apos;ll send you a fresh one.
                </p>
            </section>
        )
    }

    return (
        <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-5 py-24 text-center">
            <CheckCircle size={40} weight="fill" className="text-ink-strong" />
            <h1 className="text-xl sm:text-2xl font-semibold text-ink-strong">You&apos;re in!</h1>
            <p className="max-w-sm text-sm sm:text-base text-ink-strong/60">
                Check your email for a link to sign in and see your personalized plan.
            </p>
        </section>
    )
}

export default WelcomeContent
