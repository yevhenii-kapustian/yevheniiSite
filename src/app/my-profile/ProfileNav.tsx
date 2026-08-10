'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { House, Barbell, ForkKnife, ChartLineUp, ClockCounterClockwise } from "@phosphor-icons/react"

const TABS = [
    { href: "/my-profile", label: "My Profile", icon: House },
    { href: "/my-profile/exercises", label: "Exercises", icon: Barbell },
    { href: "/my-profile/nutrition", label: "Nutrition", icon: ForkKnife },
    { href: "/my-profile/progress", label: "Progress", icon: ChartLineUp },
    { href: "/my-profile/history", label: "History", icon: ClockCounterClockwise },
]

const ProfileNav = () => {
    const pathname = usePathname()
    const isActive = (href: string) => href === "/my-profile" ? pathname === href : pathname.startsWith(href)

    return (
        <nav className="shrink-0 lg:w-[220px]">
            <div className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                {TABS.map(tab => {
                    const active = isActive(tab.href)
                    const Icon = tab.icon
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 ${
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
    )
}

export default ProfileNav
