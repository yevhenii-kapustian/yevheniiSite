'use client'

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Camera, Trash, X } from "@phosphor-icons/react"
import Card, { CardIcon } from "../Card"
import Dropdown from "../Dropdown"

type Photo = { id: number, label: string, takenAt: string, url: string | null }

const LABEL_OPTIONS = [
    { value: "progress", label: "Progress" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
]

const LABEL_DISPLAY: Record<string, string> = { progress: "Progress", before: "Before", after: "After" }

const FILTER_TABS = [{ value: "all", label: "All" }, ...LABEL_OPTIONS]

const formatDate = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const PhotoLightbox = ({ photo, onClose }: { photo: Photo | null, onClose: () => void }) => {
    useEffect(() => {
        if (!photo) return

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleKey)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", handleKey)
            document.body.style.overflow = ""
        }
    }, [photo, onClose])

    if (typeof document === "undefined") return null

    return createPortal(
        <AnimatePresence>
            {photo && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4 sm:p-8"
                    onClick={onClose}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-200 hover:bg-white/20"
                    >
                        <X size={18} weight="bold"/>
                    </button>
                    {photo.url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={photo.url}
                            alt={`${photo.label} photo from ${photo.takenAt}`}
                            className="max-h-full max-w-full rounded-lg object-contain"
                            onClick={e => e.stopPropagation()}
                        />
                    )}
                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white">
                        {LABEL_DISPLAY[photo.label] ?? photo.label} · {formatDate(photo.takenAt)}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

const ProgressPhotos = ({ photos }: { photos: Photo[] }) => {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [label, setLabel] = useState<string | number>("progress")
    const [filter, setFilter] = useState("all")
    const [uploading, setUploading] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [openPhoto, setOpenPhoto] = useState<Photo | null>(null)

    const filteredPhotos = filter === "all" ? photos : photos.filter(photo => photo.label === filter)

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return

        setUploading(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("label", String(label))
            const res = await fetch("/api/progress-photos", { method: "POST", body: formData })
            if (res.ok) {
                router.refresh()
            } else {
                const data = await res.json().catch(() => null)
                setError(data?.message || "Couldn't upload this photo — please try again.")
            }
        } catch {
            setError("Couldn't upload this photo — please try again.")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingId(id)
        setError(null)
        try {
            const res = await fetch("/api/progress-photos", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                router.refresh()
            } else {
                const data = await res.json().catch(() => null)
                setError(data?.message || "Couldn't delete this photo — please try again.")
            }
        } catch {
            setError("Couldn't delete this photo — please try again.")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <Card className="flex flex-col gap-4 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                    <CardIcon><Camera size={14} weight="bold"/></CardIcon>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Progress photos</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="w-36">
                    <Dropdown value={label} onChange={setLabel} options={LABEL_OPTIONS}/>
                </div>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 rounded-full bg-black/[0.045] py-2 pl-3 pr-4 text-xs font-medium text-ink-strong/60 transition-colors duration-200 hover:bg-black hover:text-white disabled:opacity-40"
                >
                    <Camera size={13} weight="bold"/> {uploading ? "Uploading…" : "Add photo"}
                </button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileSelected}/>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}

            {photos.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                    {FILTER_TABS.map(tab => (
                        <button
                            key={tab.value}
                            type="button"
                            onClick={() => setFilter(tab.value)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200 ${filter === tab.value ? "bg-black text-white" : "bg-black/[0.045] text-ink-strong/60 hover:bg-black/[0.08]"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {filteredPhotos.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {filteredPhotos.map(photo => (
                        <div
                            key={photo.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setOpenPhoto(photo)}
                            onKeyDown={e => { if (e.key === "Enter") setOpenPhoto(photo) }}
                            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-black/[0.03]"
                        >
                            {photo.url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={photo.url} alt={`${photo.label} photo from ${photo.takenAt}`} className="h-full w-full object-cover"/>
                            )}
                            <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                                {LABEL_DISPLAY[photo.label] ?? photo.label}
                            </span>
                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-2">
                                <span className="text-[10px] font-medium text-white">{formatDate(photo.takenAt)}</span>
                                <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); handleDelete(photo.id) }}
                                    disabled={deletingId === photo.id}
                                    aria-label="Delete photo"
                                    className="flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity duration-200 hover:bg-black/60 group-hover:opacity-100 disabled:opacity-40"
                                >
                                    <Trash size={12} weight="bold"/>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-ink-strong/50">
                    {photos.length === 0 ? "No photos yet — add your first to start tracking visually." : `No ${filter} photos yet.`}
                </p>
            )}

            <PhotoLightbox photo={openPhoto} onClose={() => setOpenPhoto(null)}/>
        </Card>
    )
}

export default ProgressPhotos
