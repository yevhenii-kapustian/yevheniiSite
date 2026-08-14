'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, CreditCard, Trash, WarningCircle } from "@phosphor-icons/react"
import Card from "../Card"
import Modal from "../Modal"
import { getBrowserClient } from "@/supabase/browser-client"

const EXPERIENCE_OPTIONS = ["New to training", "Some experience", "Advanced"]
const DAYS_PER_WEEK_OPTIONS = ["2-3", "4", "5+"]
const EQUIPMENT_OPTIONS = ["Full gym", "Home basics", "Bodyweight only"]
const ACTIVITY_LEVEL_OPTIONS = ["Mostly sitting", "On my feet a lot", "Physically demanding job"]

const MODULE_LABELS: Record<string, string> = { nutrition: "Nutrition", training: "Training" }

type EntitlementInfo = { module: string, status: string, currentPeriodEnd: string | null }
type TrainingPrefs = { experience: string | null, daysPerWeek: string | null, equipment: string | null, activityLevel: string | null }

type SettingsContentProps = {
    email: string
    entitlements: EntitlementInfo[]
    hasSubscription: boolean
    trainingPrefs: TrainingPrefs
}

const formatDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null

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

const SettingsContent = ({ email, entitlements, hasSubscription, trainingPrefs: initialPrefs }: SettingsContentProps) => {
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
        } finally {
            setEmailSaving(false)
        }
    }

    const [portalLoading, setPortalLoading] = useState(false)

    const handleManageBilling = async () => {
        setPortalLoading(true)
        try {
            const res = await fetch("/api/billing-portal", { method: "POST" })
            const data = await res.json()
            if (data.url) window.location.href = data.url
        } finally {
            setPortalLoading(false)
        }
    }

    const [prefs, setPrefs] = useState(initialPrefs)
    const [prefsSaving, setPrefsSaving] = useState(false)
    const [prefsSaved, setPrefsSaved] = useState(false)

    const handleSavePrefs = async () => {
        setPrefsSaving(true)
        setPrefsSaved(false)
        try {
            // Only send fields the user has actually picked — sending null for an
            // unset field would fail the API's enum validation and block the whole save.
            const body: Record<string, string> = {}
            if (prefs.experience) body.experience = prefs.experience
            if (prefs.daysPerWeek) body.daysPerWeek = prefs.daysPerWeek
            if (prefs.equipment) body.equipment = prefs.equipment
            if (prefs.activityLevel) body.activityLevel = prefs.activityLevel

            await fetch("/api/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
            setPrefsSaved(true)
            router.refresh()
        } finally {
            setPrefsSaving(false)
        }
    }

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const [deleting, setDeleting] = useState(false)

    const handleDeleteAccount = async () => {
        setDeleting(true)
        try {
            const res = await fetch("/api/account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ confirm: confirmText }),
            })
            if (res.ok) {
                await getBrowserClient().auth.signOut()
                window.location.href = "/"
            }
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
                            className="shrink-0 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
                        >
                            {emailSaving ? "Sending…" : "Send confirmation"}
                        </button>
                    </div>
                    {emailSent && (
                        <p className="flex items-center gap-1.5 text-xs text-ink-strong/60">
                            <CheckCircle size={14} weight="fill"/> Check your new inbox to confirm the change.
                        </p>
                    )}
                    {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                </div>
            </Card>

            <Card className="flex flex-col gap-4 p-6 sm:p-7">
                <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Subscription</span>
                <div className="flex flex-col gap-2">
                    {["nutrition", "training"].map(module => {
                        const entitlement = entitlements.find(e => e.module === module)
                        const status = entitlement?.status ?? "none"
                        return (
                            <div key={module} className="flex items-center justify-between text-sm">
                                <span className="text-ink-strong">{MODULE_LABELS[module]}</span>
                                <span className={`text-xs font-medium ${status === "active" ? "text-ink-strong" : "text-ink-strong/40"}`}>
                                    {status === "active" && `Active${entitlement?.currentPeriodEnd ? ` · renews ${formatDate(entitlement.currentPeriodEnd)}` : ""}`}
                                    {status === "canceled" && `Canceled${entitlement?.currentPeriodEnd ? ` · ends ${formatDate(entitlement.currentPeriodEnd)}` : ""}`}
                                    {status === "expired" && "Expired"}
                                    {status === "none" && "Not subscribed"}
                                </span>
                            </div>
                        )
                    })}
                </div>
                {hasSubscription && (
                    <button
                        type="button"
                        onClick={handleManageBilling}
                        disabled={portalLoading}
                        className="mt-1 flex w-fit items-center gap-2 rounded-full bg-black/[0.045] px-4 py-2.5 text-sm font-medium text-ink-strong transition-colors duration-200 hover:bg-black/[0.08] disabled:opacity-40"
                    >
                        <CreditCard size={16}/> {portalLoading ? "Opening…" : "Manage billing & cancel"}
                    </button>
                )}
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
                        className="w-fit rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong disabled:opacity-40"
                    >
                        {prefsSaving ? "Saving…" : "Save changes"}
                    </button>
                    {prefsSaved && <span className="text-xs text-ink-strong/50">Saved — your training plan will update.</span>}
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
                        className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:opacity-40"
                    >
                        {deleting ? "Deleting…" : "Permanently delete my account"}
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default SettingsContent
