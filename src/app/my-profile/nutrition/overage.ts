// Plain module (no 'use client') so both the server component (page.tsx) and the client
// component (NutritionContent.tsx) can call getOverageLevel directly — a 'use client' file
// is treated as client-only by the bundler even for its plain, non-component exports, so a
// server component can only pass those down as props, never call them itself.

// Up to 10% over target reads as "a bit over" (yellow) — normal day-to-day variance, not
// worth alarming over. Past that, it's flagged as a clear overage (red). Goal is checked
// first so a goal of 0 (shouldn't happen, but target rows are user data) can't divide by
// zero into a false positive.
const OVERAGE_WARN_PCT = 1.10

export type OverageLevel = "none" | "warn" | "over"

export const getOverageLevel = (eaten: number, goal: number): OverageLevel => {
    if (goal <= 0 || eaten <= goal) return "none"
    return eaten <= goal * OVERAGE_WARN_PCT ? "warn" : "over"
}

export const OVERAGE_TEXT_CLASSES: Record<OverageLevel, string> = {
    none: "text-ink-strong",
    warn: "text-amber-600",
    over: "text-red-600",
}

export const OVERAGE_BAR_CLASSES: Record<OverageLevel, string> = {
    none: "bg-black",
    warn: "bg-amber-500",
    over: "bg-red-500",
}
