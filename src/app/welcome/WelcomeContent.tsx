'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, WarningCircle } from "@phosphor-icons/react"
import { getBrowserClient } from "@/supabase/browser-client"

const SIGN_IN_TIMEOUT_MS = 4000

const WelcomeContent = () => {
    const router = useRouter()
    const [status, setStatus] = useState<"working" | "no-link" | "expired">("working")

    useEffect(() => {
        const hasAuthParams = window.location.hash.includes("access_token") || new URLSearchParams(window.location.search).has("code")

        if (!hasAuthParams) {
            setStatus("no-link")
            return
        }

        // The @supabase/ssr browser client has detectSessionInUrl on by default — it
        // consumes the hash/code itself on init. Don't also call setSession /
        // exchangeCodeForSession here: two consumers racing for the same one-time
        // token is what caused "PKCE code verifier not found".
        const supabase = getBrowserClient()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) router.replace("/my-profile")
        })

        supabase.auth.getUser().then(({ data }) => {
            if (data.user) router.replace("/my-profile")
        })

        const timeout = setTimeout(() => setStatus("expired"), SIGN_IN_TIMEOUT_MS)

        return () => {
            subscription.unsubscribe()
            clearTimeout(timeout)
        }
    }, [router])

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
