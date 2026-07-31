'use client'

import { useState } from "react"
import { GoogleLogo } from "@phosphor-icons/react"
import Button from "@/components/Button"
import { getBrowserClient } from "@/supabase/browser-client"

const LoginContent = () => {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || loading) return

        setLoading(true)
        try {
            await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            setSent(true)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        await getBrowserClient().auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/welcome` },
        })
    }

    return (
        <section className="flex min-h-[60vh] items-center justify-center px-5 py-24">
            <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-6 text-center">
                <div className="flex flex-col items-center gap-1">
                    <h1 className="text-2xl font-semibold text-ink-strong">Log in</h1>
                    <p className="text-sm text-ink-strong/50">We&apos;ll email you a link to sign in.</p>
                </div>

                {sent ? (
                    <p className="text-sm text-ink-strong/60">
                        Check your email for a link to sign in.
                    </p>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-black/10 py-2.5 text-sm font-medium text-ink-strong transition-colors duration-200 hover:bg-black/5"
                        >
                            <GoogleLogo size={18} weight="bold"/>
                            Continue with Google
                        </button>

                        <div className="flex w-full items-center gap-3">
                            <span className="h-px flex-1 bg-black/10"/>
                            <span className="text-xs text-ink-strong/35">or</span>
                            <span className="h-px flex-1 bg-black/10"/>
                        </div>

                        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink-strong outline-none focus:border-black/30"
                            />
                            <Button type="submit" variant="solid" size="md" className="w-full" disabled={loading}>
                                {loading ? "Sending…" : "Send login link"}
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </section>
    )
}

export default LoginContent
