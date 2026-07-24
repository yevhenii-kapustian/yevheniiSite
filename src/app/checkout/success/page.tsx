'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Button from "@/components/Button"
import { CheckCircle, WarningCircle } from "@phosphor-icons/react"
import LoadingIcons from 'react-loading-icons'

type DownloadResult = {
    productName: string
    downloadUrl: string | null
    alreadyClaimed?: boolean
}

export default function CheckoutSuccess () {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")

    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState<DownloadResult | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!sessionId) {
            setErrorMessage("Missing payment session.")
            setLoading(false)
            return
        }

        fetch(`/api/download?session_id=${encodeURIComponent(sessionId)}`)
            .then(async res => {
                const data = await res.json()
                if (!res.ok) throw new Error(data.message || "Something went wrong")
                setResult(data)
            })
            .catch(err => setErrorMessage(err.message))
            .finally(() => setLoading(false))
    }, [sessionId])

    return (
        <section className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 py-24 text-center">
            {loading ? (
                <LoadingIcons.Oval stroke="currentColor" />
            ) : errorMessage ? (
                <>
                    <WarningCircle size={40} weight="fill" className="text-ink-strong/40" />
                    <h1 className="text-xl sm:text-2xl font-semibold text-ink-strong/80">We couldn&apos;t confirm your payment</h1>
                    <p className="max-w-md text-sm sm:text-base text-ink-strong/60">{errorMessage} If you were charged, email me and I&apos;ll sort it out right away.</p>
                    <Button href="/programs" variant="solid" size="sm" className="mt-2">
                        Back to programs
                    </Button>
                </>
            ) : (
                <>
                    <CheckCircle size={40} weight="fill" className="text-ink-strong/80" />
                    <h1 className="text-xl sm:text-2xl font-semibold text-ink-strong/80">You&apos;re all set!</h1>
                    <p className="max-w-md text-sm sm:text-base text-ink-strong/60">
                        Thanks for grabbing <span className="font-semibold text-ink-strong">{result?.productName}</span>. Your plan is ready below.
                    </p>
                    {result?.downloadUrl ? (
                        <Button href={result.downloadUrl} target="_blank" variant="solid" size="sm" className="mt-2">
                            Download your plan
                        </Button>
                    ) : result?.alreadyClaimed ? (
                        <p className="max-w-md text-sm text-ink-strong/60">
                            This link has already been used to unlock the plan. If that wasn&apos;t you, or you lost your copy, email me and I&apos;ll help you out.
                        </p>
                    ) : (
                        <p className="max-w-md text-sm text-ink-strong/60">
                            Your payment went through, but the file isn&apos;t linked up yet — email me and I&apos;ll send it over personally.
                        </p>
                    )}
                    <Link href="/programs" className="mt-4 text-sm text-ink-strong/50 underline underline-offset-4 hover:text-ink-strong">
                        Back to all programs
                    </Link>
                </>
            )}
        </section>
    )
}
