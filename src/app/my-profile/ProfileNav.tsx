'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
    { href: "/my-profile", label: "My Profile" },
    { href: "/my-profile/exercises", label: "Exercises" },
    { href: "/my-profile/nutrition", label: "Nutrition" },
    { href: "/my-profile/progress", label: "Progress" },
    { href: "/my-profile/history", label: "History" },
]

const ProfileNav = () => {
    const pathname = usePathname()

    return (
        <nav className="mt-10 border-b border-black/[0.06] px-5 sm:px-10 lg:px-20">
            <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto sm:gap-6">
                {TABS.map(tab => {
                    const isActive = tab.href === "/my-profile" ? pathname === tab.href : pathname.startsWith(tab.href)
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`shrink-0 border-b-2 py-3 text-sm font-medium transition-colors duration-200 ${isActive ? "border-black text-ink-strong" : "border-transparent text-ink-strong/40 hover:text-ink-strong"}`}
                        >
                            {tab.label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default ProfileNav
