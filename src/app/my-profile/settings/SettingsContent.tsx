'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, CreditCard, DownloadSimple, Trash, WarningCircle } from "@phosphor-icons/react"
import Card from "../Card"
import Modal from "../Modal"
import Spinner from "@/components/Spinner"
import { getBrowserClient } from "@/supabase/browser-client"

const EXPERIENCE_OPTIONS = ["New to training", "Some experience", "Advanced"]
const DAYS_PER_WEEK_OPTIONS = ["2-3", "4", "5+"]
const EQUIPMENT_OPTIONS = ["Full gym", "Home basics", "Bodyweight only"]
const ACTIVITY_LEVEL_OPTIONS = ["Mostly sitting", "On my feet a lot", "Physically demanding job"]

type EntitlementInfo = { module: string, status: string, currentPeriodEnd: string | null, cancelAtPeriodEnd: boolean, stripeSubscriptionId: string | null }
type TrainingPrefs = { experience: string | null, daysPerWeek: string | null, equipment: string | null, activityLevel: string | null }

type SubscriptionPrice = { amount: number, interval: string, currency: string }

type SettingsContentProps = {
    email: string
    entitlements: EntitlementInfo[]
    hasSubscription: boolean
    subscriptionPricesById: Record<string, SubscriptionPrice | null>
    trainingPrefs: TrainingPrefs
}

const MODULE_LABELS: Record<string, string> = { nutrition: "Nutrition", training: "Training" }

const moduleGroupLabel = (modules: string[]) =>
    modules.length > 0 ? modules.map(m => MODULE_LABELS[m] ?? m).join(" & ") : "Nutrition & Training"

const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null

const formatPrice = ({ amount, interval, currency }: SubscriptionPrice) =>
    `${new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: amount % 1 === 0 ? 0 : 2 }).format(amount)}/${interval === "month" ? "mo" : "yr"}`

const PillGroup = ({ options, value, onChange }: { options: string[], value: string | null, onChange: (value: string) => void }) => (
    <div className="flex flex-wrap gap-2">
        {options.map(option => (
            <button
                key={option}
                type="button"
                onClick={() => onChange(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    value === option ? "bg-black text-white" : "bg-black/[0.045] text-ink-strong/60 hover:bg-black/[0.08]"
                }`}
            >
                {option}
            </button>
        ))}
    </div>
)

const SettingsContent = ({ email, entitlements, hasSubscription, subscriptionPricesById, trainingPrefs: initialPrefs }: SettingsContentProps) => {
    const router = useRouter()

    const [newEmail, setNewEmail] = useState("")
    const [emailSaving, setEmailSaving] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const [emailError, setEmailError] = useState<string | null>(null)

    const handleEmailChange = async () => {
        setEmailSaving(true)
        setEmailError(null)
        try {
            const res = await fetch("/api/account/email", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: newEmail }),
            })
            const data = await res.json()
            if (!res.ok) {
                setEmailError(data.message || "Something went wrong")
                return
            }
            setEmailSent(true)
            setNewEmail("")
        } catch {
            setEmailError("Something went wrong — please try again.")
        } finally {
            setEmailSaving(false)
        }
    }

    const [portalLoading, setPortalLoading] = useState(false)
    const [portalError, setPortalError] = useState<string | null>(null)

    const handleManageBilling = async () => {
        setPortalLoading(true)
        setPortalError(null)
        try {
            const res = await fetch("/api/billing-portal", { method: "POST" })
            const data = await res.json()
            if (data.url) {
                window.location.href = data.url
            } else {
                setPortalError(data.message || "Couldn't open billing portal — please try again.")
            }
        } catch {
            setPortalError("Couldn't open billing portal — please try again.")
        } finally {
            setPortalLoading(false)
        }
    }

    const [prefs, setPrefs] = useState(initialPrefs)
    const [prefsSaving, setPrefsSaving] = useState(false)
    const [prefsSaved, setPrefsSaved] = useState(false)
    const [prefsError, setPrefsError] = useState<string | null>(null)

    const handleSavePrefs = async () => {
        setPrefsSaving(true)
        setPrefsSaved(false)
        setPrefsError(null)
        try {
            // Only send fields the user has actually picked — sending null for an
            // unset field would fail the API's enum validation and block the whole save.
            const body: Record<string, string> = {}
            if (prefs.experience) body.experience = prefs.experience
            if (prefs.daysPerWeek) body.daysPerWeek = prefs.daysPerWeek
            if (prefs.equipment) body.equipment = prefs.equipment
            if (prefs.activityLevel) body.activityLevel = prefs.activityLevel

            const res = await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => null)
                setPrefsError(data?.message || "Couldn't save — please try again.")
                return
            }
            setPrefsSaved(true)
            router.refresh()
        } catch {
            setPrefsError("Couldn't save — please try again.")
        } finally {
            setPrefsSaving(false)
        }
    }

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const [deleting, setDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState<string | null>(null)

    const handleDeleteAccount = async () => {
        setDeleting(true)
        setDeleteError(null)
        try {
            const res = await fetch("/api/account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirm: confirmText }),
            })
            if (res.ok) {
                await getBrowserClient().auth.signOut()
                window.location.href = "/"
            } else {
                const data = await res.json().catch(() => null)
                setDeleteError(data?.message || "Couldn't delete your account — please try again.")
            }
        } catch {
            setDeleteError("Couldn't delete your account — please try again.")
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-4 p-6 sm:p-7">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Account</span>
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-ink-strong/40">Current email</span>
                    <span className="text-sm font-medium text-ink-strong">{email}</span>
                </div>
                <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                    <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Change email</label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="email"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                            placeholder="new@email.com"
                            className="flex-1 rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                        />
                        <button
                            type="button"
                            onClick={handleEmailChange}
                            disabled={emailSaving || !newEmail}
                            className="relative shrink-0 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
                        >
                            <span className={emailSaving ? "invisible" : ""}>Send confirmation</span>
                            {emailSaving && <span className="absolute inset-0 flex items-center justify-center"><Spinner/></span>}
                        </button>
                    </div>
                    {emailSent ? (
                        <p className="flex items-center gap-1.5 text-xs text-ink-strong/60">
                            <CheckCircle size={14} weight="fill"/> Almost done — confirm the link in both your old and new inbox to finish the change.
                        </p>
                    ) : (
                        <p className="text-xs text-ink-strong/35">We&apos;ll send a confirmation link to both your current and new email — the change only takes effect once you confirm both.</p>
                    )}
                    {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                </div>
                <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                    <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Your data</label>
                    <a
                        href="/api/account/export"
                        className="flex w-fit items-center gap-2 rounded-full bg-black/[0.045] px-4 py-2.5 text-sm font-medium text-ink-strong transition-colors duration-200 hover:bg-black/[0.08]"
                    >
                        <DownloadSimple size={16}/> Download my data
                    </a>
                </div>
            </Card>

            <Card className="flex flex-col gap-4 p-6 sm:p-7">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Subscription</span>
                {(() => {
                    // A module bought standalone (e.g. adding Nutrition later from the
                    // dashboard) gets its own stripe_subscription_id, separate from the
                    // bundle's — so there can genuinely be more than one row here, each with
                    // its own status/renewal date. Grouping by subscription id (falling back
                    // to one group per un-subscribed module) instead of only ever reading
                    // entitlements[0] means a second, independent subscription doesn't just
                    // disappear from the UI.
                    const groups = new Map<string, EntitlementInfo[]>()
                    for (const entitlement of entitlements) {
                        const key = entitlement.stripeSubscriptionId ?? `none:${entitlement.module}`
                        groups.set(key, [...(groups.get(key) ?? []), entitlement])
                    }
                    if (groups.size === 0) groups.set("none", [])

                    return Array.from(groups.entries()).map(([key, group]) => {
                        const modules = group.map(e => e.module)
                        const status = group[0]?.status ?? "none"
                        const cancelling = status === "active" && group[0]?.cancelAtPeriodEnd
                        const dateLabel = formatDate(group[0]?.currentPeriodEnd ?? null)
                        const price = group[0]?.stripeSubscriptionId ? subscriptionPricesById[group[0].stripeSubscriptionId] : null

                        const badge = cancelling
                            ? { dot: "border border-ink-strong", pill: "bg-black/[0.045] text-ink-strong", label: "Ending soon" }
                            : status === "active"
                                ? { dot: "bg-ink-strong", pill: "bg-black/[0.045] text-ink-strong", label: "Active" }
                                : status === "canceled"
                                    ? { dot: "bg-ink-strong/25", pill: "bg-black/[0.03] text-ink-strong/40", label: "Canceled" }
                                    : status === "expired"
                                        ? { dot: "bg-ink-strong/25", pill: "bg-black/[0.03] text-ink-strong/40", label: "Expired" }
                                        : { dot: "bg-ink-strong/15", pill: "bg-black/[0.03] text-ink-strong/40", label: "Not subscribed" }

                        const caption = cancelling
                            ? dateLabel && `Ends ${dateLabel}`
                            : status === "active"
                                ? dateLabel && `Renews ${dateLabel}`
                                : status === "canceled"
                                    ? dateLabel && `Ends ${dateLabel}`
                                    : null

                        return (
                            <div key={key} className="flex items-center justify-between border-b border-black/[0.05] pb-3 last:border-b-0 last:pb-0">
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-ink-strong">{moduleGroupLabel(modules)}</span>
                                    {price && <span className="text-[11px] text-ink-strong/40">{formatPrice(price)}</span>}
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`flex items-center gap-1.5 rounded-full py-1 pl-2 pr-2.5 text-xs font-medium ${badge.pill}`}>
                                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${badge.dot}`}/>
                                        {badge.label}
                                    </span>
                                    {caption && <span className="text-[11px] text-ink-strong/40">{caption}</span>}
                                </div>
                            </div>
                        )
                    })
                })()}
                {hasSubscription && (
                    <button
                        type="button"
                        onClick={handleManageBilling}
                        disabled={portalLoading}
                        className="relative mt-1 flex w-fit items-center gap-2 rounded-full bg-black/[0.045] px-4 py-2.5 text-sm font-medium text-ink-strong transition-colors duration-200 hover:bg-black/[0.08] disabled:opacity-40"
                    >
                        <span className={`flex items-center gap-2 ${portalLoading ? "invisible" : ""}`}>
                            <CreditCard size={16}/> Manage billing & cancel
                        </span>
                        {portalLoading && <span className="absolute inset-0 flex items-center justify-center"><Spinner/></span>}
                    </button>
                )}
                {portalError && <p className="text-xs text-red-500">{portalError}</p>}
            </Card>

            <Card className="flex flex-col gap-5 p-6 sm:p-7">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Training profile</span>

                <div className="flex flex-col gap-2">
                    <label className="text-xs text-ink-strong/40">Experience</label>
                    <PillGroup options={EXPERIENCE_OPTIONS} value={prefs.experience} onChange={value => setPrefs(p => ({ ...p, experience: value }))}/>
                </div>
                <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                    <label className="text-xs text-ink-strong/40">Days per week</label>
                    <PillGroup options={DAYS_PER_WEEK_OPTIONS} value={prefs.daysPerWeek} onChange={value => setPrefs(p => ({ ...p, daysPerWeek: value }))}/>
                </div>
                <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                    <label className="text-xs text-ink-strong/40">Equipment</label>
                    <PillGroup options={EQUIPMENT_OPTIONS} value={prefs.equipment} onChange={value => setPrefs(p => ({ ...p, equipment: value }))}/>
                </div>
                <div className="flex flex-col gap-2 border-t border-black/[0.05] pt-4">
                    <label className="text-xs text-ink-strong/40">Daily activity outside training</label>
                    <PillGroup options={ACTIVITY_LEVEL_OPTIONS} value={prefs.activityLevel} onChange={value => setPrefs(p => ({ ...p, activityLevel: value }))}/>
                </div>

                <div className="flex items-center gap-3 border-t border-black/[0.05] pt-4">
                    <button
                        type="button"
                        onClick={handleSavePrefs}
                        disabled={prefsSaving}
                        className="relative w-fit rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
                    >
                        <span className={prefsSaving ? "invisible" : ""}>Save changes</span>
                        {prefsSaving && <span className="absolute inset-0 flex items-center justify-center"><Spinner/></span>}
                    </button>
                    {prefsSaved && <span className="text-xs text-ink-strong/50">Saved — your training plan will update.</span>}
                    {prefsError && <span className="text-xs text-red-500">{prefsError}</span>}
                </div>
            </Card>

            <Card className="flex flex-col gap-3 p-6 sm:p-7">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500/70">Danger zone</span>
                <p className="text-sm text-ink-strong/60">
                    Permanently delete your account and all your data (meals, workouts, check-ins, progress). This can&apos;t be undone.
                </p>
                <button
                    type="button"
                    onClick={() => setDeleteOpen(true)}
                    className="flex w-fit items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50"
                >
                    <Trash size={16}/> Delete account
                </button>
            </Card>

            <Modal open={deleteOpen} title="Delete account" onClose={() => setDeleteOpen(false)}>
                <div className="flex flex-col gap-4">
                    <p className="flex items-start gap-2 text-sm text-ink-strong/70">
                        <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-red-500"/>
                        This permanently deletes your account and every meal, workout, and check-in you&apos;ve logged. There&apos;s no undo.
                    </p>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">
                            Type DELETE to confirm
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            className="rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        disabled={confirmText !== "DELETE" || deleting}
                        className="flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-40"
                    >
                        {deleting ? <Spinner/> : "Permanently delete my account"}
                    </button>
                    {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
                </div>
            </Modal>
        </div>
    )
}

export default SettingsContent
