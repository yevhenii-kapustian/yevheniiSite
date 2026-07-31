import type { Metadata } from "next"
import { Suspense } from "react"
import WelcomeContent from "./WelcomeContent"

export const metadata: Metadata = {
    title: "You're In - Yevhenii Fit",
}

export default function Welcome () {
    return (
        <Suspense fallback={
            <section className="flex min-h-[60vh] items-center justify-center px-5 py-24">
                <p className="text-sm text-ink-strong/60">Loading…</p>
            </section>
        }>
            <WelcomeContent/>
        </Suspense>
    )
}
