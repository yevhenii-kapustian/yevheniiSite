export type ModuleState = "active" | "lapsed" | "none"

type EntitlementRow = { module: string, status: string }

export const getModuleState = (entitlements: EntitlementRow[], module: string): ModuleState => {
    const rows = entitlements.filter(e => e.module === module)
    if (rows.some(e => e.status === "active")) return "active"
    if (rows.length > 0) return "lapsed"
    return "none"
}

// Page-level entitlement checks (redirect to an upsell if the module isn't active) only
// stop a browser following the normal UI — they do nothing against a request made directly
// against the API. This is the same check, for API routes that mutate module-specific data
// (meal logs, workout sets, exercise swaps) so a request can't just skip the page and use a
// paid feature for free.
export const hasActiveModule = (entitlements: EntitlementRow[], module: string): boolean =>
    entitlements.some(e => e.module === module && e.status === "active")

const formatPeriodEnd = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null

// A lapsed (canceled/expired) subscriber sees "your access ended" + a resubscribe CTA
// instead of the generic never-purchased upsell shown to a first-time visitor.
export const upsellCopy = (state: ModuleState, periodEnd: string | null, neverPurchasedMessage: string, price: number | null) => {
    const priceLabel = price != null ? ` — $${price}/mo` : ""

    if (state === "lapsed") {
        const endDate = formatPeriodEnd(periodEnd)
        return {
            message: `Your access ended${endDate ? ` on ${endDate}` : ""}. Resubscribe to pick up where you left off.`,
            buttonLabel: `Resubscribe${priceLabel}`,
        }
    }
    return { message: neverPurchasedMessage, buttonLabel: `Get full access${priceLabel}` }
}
