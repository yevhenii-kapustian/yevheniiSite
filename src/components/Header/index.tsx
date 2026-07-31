'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretRight, List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import { navigation, Navigation } from "@/data/navigation";
import { getBrowserClient } from "@/supabase/browser-client";
import Logo from "../Logo";

const SCROLL_THRESHOLD = 20;

const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring" as const, damping: 32, stiffness: 320 } },
    exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" as const } }
}

const drawerListVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } }
}

const drawerItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } }
}

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const headerRef = useRef<HTMLElement>(null);
    const drawerRef = useRef<HTMLDivElement>(null);

    const pathname = usePathname();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const supabase = getBrowserClient()
        supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null))

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user.email ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await getBrowserClient().auth.signOut()
        window.location.href = "/"
    }

    const toggleMobileMenu = ():void => {
        setMobileOpen(!mobileOpen)
    }

    useEffect(() => {
        setMobileOpen(false)
    }, [pathname])

    useEffect(() => {
        if (!mobileOpen) return

        const handleClickOutside = (e: MouseEvent):void => {
            const target = e.target as Node
            const insideHeader = headerRef.current?.contains(target)
            const insideDrawer = drawerRef.current?.contains(target)
            if (!insideHeader && !insideDrawer) {
                setMobileOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [mobileOpen])

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
        <>
            <motion.header
                ref={headerRef}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="sticky left-0 top-0 z-50 w-full px-3 pt-3 sm:px-6 sm:pt-4">
                <div className={clsx(
                        "relative mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-[#1c1c1e]/80 px-3 py-2 backdrop-blur-xl transition-shadow duration-300 sm:px-4",
                        isElevated
                            ? "shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                            : "shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                    )}>
                    <div className="flex min-w-0 items-center">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                            <Logo/>
                        </div>
                        <Link href="/" className="ml-3 hidden text-sm font-semibold text-white sm:block">
                            Yevhenii Fit
                        </Link>
                    </div>

                    <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-white/10 p-1 text-sm font-medium text-white lg:flex">
                        {navigation.map((item:Navigation) => {
                            const isActive = pathname === item.path
                            return (
                                <Link
                                    className={clsx(
                                        "rounded-full px-4 py-2 capitalize transition-colors duration-200",
                                        isActive ? "bg-white text-black shadow-sm" : "text-white/70 hover:bg-white/10 hover:text-white"
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

                    <div className="flex items-center justify-end gap-2">
                        {userEmail ? (
                            <>
                                <button
                                    onClick={handleSignOut}
                                    className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-white/70 transition-colors duration-200 hover:text-white lg:inline-flex"
                                >
                                    Sign out
                                </button>
                                <Link
                                    href="/my-profile"
                                    className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-colors duration-200 hover:bg-white/90 lg:inline-flex"
                                >
                                    My Profile
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-white/70 transition-colors duration-200 hover:text-white lg:inline-flex"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/get-started"
                                    className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-colors duration-200 hover:bg-white/90 lg:inline-flex"
                                >
                                    Get started
                                </Link>
                            </>
                        )}

                        <button
                            onClick={toggleMobileMenu}
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-nav"
                            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10 lg:hidden"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={mobileOpen ? "close" : "open"}
                                    initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="flex"
                                >
                                    {mobileOpen ? <X size={20} weight="bold" /> : <List size={21} weight="bold" />}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        ref={drawerRef}
                        variants={drawerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-y-0 right-0 z-[60] flex w-[78%] max-w-xs flex-col border-l border-white/10 bg-[#1c1c1e] pt-[calc(env(safe-area-inset-top)+16px)] shadow-[-24px_0_70px_rgba(0,0,0,0.4)] lg:hidden"
                    >
                        <div className="flex items-center justify-end px-4">
                            <button
                                onClick={() => setMobileOpen(false)}
                                aria-label="Close menu"
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/10"
                            >
                                <X size={20} weight="bold" />
                            </button>
                        </div>

                        <motion.ul
                            id="mobile-nav"
                            variants={drawerListVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-1 flex-col gap-1 px-6 pt-2 text-base text-white"
                        >
                            {navigation.map((item:Navigation, index:number) => {
                                const isActive = pathname === item.path
                                return (
                                    <motion.li variants={drawerItemVariants} key={item.name}>
                                        <Link
                                            className={clsx(
                                                "flex items-baseline gap-3 py-2.5 capitalize transition-colors duration-150",
                                                isActive ? "font-semibold text-white" : "text-white/70 hover:text-white"
                                            )}
                                            onClick={() => setMobileOpen(false)}
                                            href={item.path}
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            <span className="text-xs text-white/30">0{index + 1}</span>
                                            {item.name}
                                        </Link>
                                    </motion.li>
                                )
                            })}
                        </motion.ul>

                        <div className="flex flex-col border-t border-white/10 px-6 py-4">
                            {userEmail ? (
                                <>
                                    <Link
                                        href="/my-profile"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between py-2 text-sm font-semibold text-white"
                                    >
                                        My Profile
                                        <CaretRight size={16} weight="bold" className="text-white/50" />
                                    </Link>
                                    <button
                                        onClick={() => { setMobileOpen(false); handleSignOut() }}
                                        className="flex items-center justify-between py-2 text-left text-sm font-semibold text-white/70"
                                    >
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/get-started"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between py-2 text-sm font-semibold text-white"
                                    >
                                        Get started
                                        <CaretRight size={16} weight="bold" className="text-white/50" />
                                    </Link>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-between py-2 text-sm font-semibold text-white/70"
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Header
