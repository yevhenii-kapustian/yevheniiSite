'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import clsx from "clsx";

import { navigation, Navigation } from "@/data/navigation";
import Logo from "../Logo";

const SCROLL_THRESHOLD = 20;

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const pathname = usePathname();

    const toggleMobileMenu = ():void => {
        setMobileOpen(!mobileOpen)
    }

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    useEffect(() => {
        const handleScroll = ():void => {
            setIsScrolled(window.scrollY >= SCROLL_THRESHOLD)
        }
        handleScroll()

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isElevated = isScrolled || mobileOpen

    return(
        <header className="sticky left-0 top-0 z-50 w-full px-3 pt-3 sm:px-6 sm:pt-4">
            <div className={clsx(
                "mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/75 bg-white/[0.92] px-3 py-2 backdrop-blur-xl transition-shadow duration-300 sm:px-4",
                isElevated
                    ? "shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
                    : "shadow-[0_18px_60px_rgba(0,0,0,0.16)]"
            )}>
                <div className="flex min-w-0 flex-1 items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal p-1.5 shadow-sm sm:h-11 sm:w-11">
                        <Logo/>
                    </div>
                    <Link href="/" className="ml-3 hidden text-sm font-semibold tracking-normal text-ink-strong sm:block">
                        Yevhenii Fit
                    </Link>
                </div>

                <nav className="flex flex-1 items-center justify-end gap-3 lg:justify-between">
                    <div className="hidden items-center rounded-full bg-black/[0.04] p-1 text-sm font-medium text-ink-strong lg:flex">
                        {navigation.filter((item:Navigation) => item.path !== "/programs").map((item:Navigation) => {
                            const isActive = pathname === item.path
                            return (
                                <Link
                                    className={clsx(
                                        "rounded-full px-4 py-2 capitalize transition-colors duration-200",
                                        isActive ? "bg-white text-black shadow-sm" : "text-ink-strong/68 hover:bg-white/70 hover:text-black"
                                    )}
                                    key={item.name}
                                    href={item.path}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </div>

                    <div className="hidden items-center justify-end gap-2 lg:flex">
                        <Link
                            href="/programs"
                            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-strong/72 transition-colors duration-200 hover:bg-black/[0.04] hover:text-black"
                        >
                            Programs
                        </Link>
                        <Link
                            href="/#formCoaching"
                            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-ink-strong"
                        >
                            Get started
                        </Link>
                    </div>

                    <button
                        onClick={toggleMobileMenu}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors duration-200 hover:bg-ink-strong lg:hidden"
                    >
                        {mobileOpen ? <X size={20} weight="bold" /> : <List size={21} weight="bold" />}
                    </button>
                </nav>
            </div>

            {mobileOpen && (
                <div className="mx-auto mt-2 max-w-6xl rounded-[1.5rem] border border-white/75 bg-white/95 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:hidden">
                    <ul id="mobile-nav" className="flex flex-col gap-1 text-base font-medium text-ink-strong">
                        {navigation.map((item:Navigation) => {
                            const isActive = pathname === item.path
                            return (
                                <li key={item.name}>
                                    <Link
                                        className={clsx(
                                            "flex rounded-2xl px-4 py-3 capitalize transition-colors duration-200",
                                            isActive ? "bg-black text-white" : "text-ink-strong/72 hover:bg-black/[0.04] hover:text-black"
                                        )}
                                        onClick={() => setMobileOpen(false)}
                                        href={item.path}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            )
                        })}
                        <li className="pt-2">
                            <Link
                                href="/#formCoaching"
                                onClick={() => setMobileOpen(false)}
                                className="flex justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-ink-strong"
                            >
                                Get started
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    )
}

export default Header
