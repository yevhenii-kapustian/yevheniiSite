'use client'

import Logo from "../Logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react"
import { navigation, Navigation } from "@/data/navigation"

const Footer = () => {
    const pathname = usePathname()
    const currentYear = new Date().getFullYear()

    if (pathname.startsWith("/my-profile")) return null

    return(
        <footer className="bg-surface-strong text-white">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start gap-4">
                    <div className="w-20">
                        <Logo/>
                    </div>
                    <p className="text-sm text-white/50">
                        Online coaching for real, lasting transformation.
                    </p>
                    <div className="flex gap-2">
                        <a
                            href="mailto:yevheni.fit@gmail.com?Subject=I would like to ask"
                            target="_top"
                            aria-label="Email"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors duration-200 hover:bg-white/10"
                        >
                            <EnvelopeSimple color="white" size={18} />
                        </a>
                        <a
                            target="_blank"
                            href="https://www.instagram.com/_ev_ge_niii_/"
                            aria-label="Instagram"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors duration-200 hover:bg-white/10"
                        >
                            <InstagramLogo color="white" size={18} />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Navigate</h3>
                    {navigation.map((item:Navigation) => (
                        <Link key={item.name} className="text-sm text-white/60 hover:text-white capitalize transition-colors" href={item.path}>
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Legal</h3>
                    <Link className="text-sm text-white/60 hover:text-white transition-colors" href="/legal/terms-conditions">Terms and conditions</Link>
                    <Link className="text-sm text-white/60 hover:text-white transition-colors" href="/legal/privacy">Privacy policy</Link>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Contact</h3>
                    <a className="text-sm text-white/60 hover:text-white transition-colors" href="mailto:yevheni.fit@gmail.com?Subject=I would like to ask">
                        yevheni.fit@gmail.com
                    </a>
                </div>
            </div>

            <div className="border-t border-white/10">
                <p className="max-w-7xl mx-auto px-5 sm:px-8 py-5 text-center text-xs text-white/40">
                    © {currentYear} Yevhenii Fit. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer
