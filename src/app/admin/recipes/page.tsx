'use client'

import { useState } from "react"

type SyncResult = { message: string, synced?: number, found?: number, skipped?: number }
type BackfillResult = { message: string, checked?: number, updated?: number, failed?: number, firstError?: string | null }

const AdminRecipesSyncPage = () => {
    const [secret, setSecret] = useState("")
    const [query, setQuery] = useState("")
    const [minProtein, setMinProtein] = useState("")
    const [minCalories, setMinCalories] = useState("")
    const [maxCalories, setMaxCalories] = useState("")
    const [number, setNumber] = useState(10)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<SyncResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [backfillLoading, setBackfillLoading] = useState(false)
    const [backfillResult, setBackfillResult] = useState<BackfillResult | null>(null)
    const [backfillError, setBackfillError] = useState<string | null>(null)

    const handleSync = async () => {
        setLoading(true)
        setError(null)
        setResult(null)
        try {
            const res = await fetch("/api/admin/recipes/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-admin-secret": secret },
                body: JSON.stringify({
                    query: query.trim() || undefined,
                    number,
                    minProtein: minProtein || undefined,
                    minCalories: minCalories || undefined,
                    maxCalories: maxCalories || undefined,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setResult(data)
            } else {
                setError(data.message || "Sync failed")
            }
        } catch {
            setError("Sync failed — check your connection and that the secret is correct.")
        } finally {
            setLoading(false)
        }
    }

    const handleBackfill = async () => {
        setBackfillLoading(true)
        setBackfillError(null)
        setBackfillResult(null)
        try {
            const res = await fetch("/api/admin/recipes/backfill-ingredients", {
                method: "POST",
                headers: { "x-admin-secret": secret },
            })
            const data = await res.json()
            if (res.ok) {
                setBackfillResult(data)
            } else {
                setBackfillError(data.message || "Backfill failed")
            }
        } catch {
            setBackfillError("Backfill failed — check your connection and that the secret is correct.")
        } finally {
            setBackfillLoading(false)
        }
    }

    return (
        <div className="mx-auto flex max-w-md flex-col gap-5 px-6 py-16">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold text-ink-strong">Recipe sync</h1>
                <p className="text-sm text-ink-strong/50">
                    Not linked from anywhere in the app — pulls a batch of recipes from Spoonacular straight into the recipes table. Max 20 per click, on purpose, to keep quota usage predictable.
                </p>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Admin secret</label>
                <input
                    type="password"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    placeholder="ADMIN_SYNC_SECRET from .env.local"
                    className="rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Food / meal type (text match — keep this simple)</label>
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="e.g. breakfast, chicken, salad, dinner"
                    className="rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
                <p className="text-xs text-ink-strong/35">This is matched against recipe titles literally — a plain food/meal word works, a whole descriptive phrase usually won&apos;t match anything.</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Min protein (g)</label>
                    <input
                        type="number"
                        min={0}
                        value={minProtein}
                        onChange={e => setMinProtein(e.target.value)}
                        placeholder="e.g. 25"
                        className="rounded-2xl bg-black/[0.03] px-3 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Min kcal</label>
                    <input
                        type="number"
                        min={0}
                        value={minCalories}
                        onChange={e => setMinCalories(e.target.value)}
                        placeholder="e.g. 500"
                        className="rounded-2xl bg-black/[0.03] px-3 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                    />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Max kcal</label>
                    <input
                        type="number"
                        min={0}
                        value={maxCalories}
                        onChange={e => setMaxCalories(e.target.value)}
                        placeholder="e.g. 400"
                        className="rounded-2xl bg-black/[0.03] px-3 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                    />
                </div>
            </div>
            <p className="-mt-3 text-xs text-ink-strong/35">
                These are real Spoonacular nutrition filters, not text — this is how to actually target &quot;high protein&quot; or &quot;high calorie&quot;/&quot;low calorie&quot; instead of typing it into the query above.
            </p>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">How many (max 20)</label>
                <input
                    type="number"
                    min={1}
                    max={20}
                    value={number}
                    onChange={e => setNumber(Math.min(Math.max(Number(e.target.value) || 1, 1), 20))}
                    className="rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
            </div>

            <button
                type="button"
                onClick={handleSync}
                disabled={loading || !secret}
                className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
            >
                {loading ? "Syncing…" : "Sync recipes"}
            </button>

            {result && (
                <div className="flex flex-col gap-1">
                    <p className="text-sm text-emerald-600">
                        Success — {result.synced} recipe{result.synced === 1 ? "" : "s"} saved.
                    </p>
                    {!!result.skipped && (
                        <p className="text-xs text-ink-strong/40">
                            Spoonacular found {result.found}, skipped {result.skipped} that had no step-by-step instructions or nutrition data.
                        </p>
                    )}
                    {result.found === 0 && (
                        <p className="text-xs text-amber-600">
                            Spoonacular found 0 matches for this exact combination — try a simpler food word, or loosen the min/max kcal range.
                        </p>
                    )}
                </div>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="mt-4 flex flex-col gap-3 border-t border-black/[0.06] pt-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-semibold text-ink-strong">Backfill missing ingredients</h2>
                    <p className="text-xs text-ink-strong/50">
                        For recipes already saved before ingredients were fixed — fetches each one by its own id (cheaper than re-searching), up to 20 per click, only for recipes with an empty ingredient list.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleBackfill}
                    disabled={backfillLoading || !secret}
                    className="w-fit rounded-full bg-black/[0.045] px-5 py-2.5 text-sm font-semibold text-ink-strong transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40"
                >
                    {backfillLoading ? "Checking…" : "Backfill ingredients"}
                </button>
                {backfillResult && (
                    <div className="flex flex-col gap-1">
                        <p className="text-sm text-emerald-600">
                            Checked {backfillResult.checked}, updated {backfillResult.updated}{!!backfillResult.failed && `, ${backfillResult.failed} failed`}.
                            {backfillResult.checked === 0 && " Nothing left to backfill."}
                        </p>
                        {backfillResult.firstError && (
                            <p className="text-xs text-red-500">First error: {backfillResult.firstError}</p>
                        )}
                    </div>
                )}
                {backfillError && <p className="text-sm text-red-500">{backfillError}</p>}
            </div>
        </div>
    )
}

export default AdminRecipesSyncPage
