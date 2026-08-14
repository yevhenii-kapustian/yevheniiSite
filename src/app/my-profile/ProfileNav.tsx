'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, Barbell, ForkKnife, ChartLineUp, ClockCounterClockwise, Gear } from "@phosphor-icons/react"

const TABS = [
    { href: "/my-profile", label: "My Profile", icon: House },
    { href: "/my-profile/exercises", label: "Exercises", icon: Barbell },
    { href: "/my-profile/nutrition", label: "Nutrition", icon: ForkKnife },
    { href: "/my-profile/progress", label: "Progress", icon: ChartLineUp },
    { href: "/my-profile/history", label: "History", icon: ClockCounterClockwise },
    { href: "/my-profile/settings", label: "Settings", icon: Gear },
]

const ProfileNav = () => {
    const pathname = usePathname()
    const isActive = (href: string) => (
        href === "/my-profile"
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`)
    )

    return (
        <>
            <nav className="hidden shrink-0 lg:block lg:w-[220px]">
                <div className="flex flex-col gap-1">
                    {TABS.map(tab => {
                        const active = isActive(tab.href)
                        const Icon = tab.icon
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-black/20 ${
                                    active ? "bg-black text-white" : "text-ink-strong/55 hover:bg-black/[0.04]"
                                }`}
                            >
                                <Icon size={18} weight={active ? "fill" : "regular"}/>
                                {tab.label}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            <nav className="mobile-tab-bar fixed inset-x-0 bottom-0 z-[70] lg:hidden">
                <div className="nav-blur absolute inset-0 border-t border-black/[0.06] bg-white/95 shadow-[0_-10px_30px_rgba(0,0,0,0.06)]"/>
                <div className="relative grid min-h-14 grid-cols-6">
                    {TABS.map(tab => {
                        const active = isActive(tab.href)
                        const Icon = tab.icon
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`mobile-tab-label flex min-w-0 flex-col items-center justify-center gap-1 px-1 font-medium outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-black/20 ${
                                    active ? "text-black" : "text-ink-strong/40"
                                }`}
                            >
                                <Icon className="shrink-0" size={20} weight={active ? "fill" : "regular"}/>
                                <span className="block max-w-full truncate">{tab.label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}

export default ProfileNav
