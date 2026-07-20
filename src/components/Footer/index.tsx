'use client'

import Logo from "../Logo"
import Link from "next/link"
import { InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react"
import { navigation, Navigation } from "@/data/navigation"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return(
        <footer className="bg-black text-white">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start gap-4">
                    <div className="w-24">
                        <Logo/>
                    </div>
                    <p className="text-sm text-white/60">
                        Online coaching for real, lasting transformation.
                    </p>
                    <div className="flex gap-4">
                        <a href="mailto:ke1vin.kapustian@gmail.com?Subject=I would like to ask" target="_top" aria-label="Email">
                            <EnvelopeSimple color="white" size={22} />
                        </a>
                        <a target="_blank" href="https://www.instagram.com/_ev_ge_niii_/" aria-label="Instagram">
                            <InstagramLogo color="white" size={22} />
                        </a>
                    </div>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Navigate</h3>
                    {navigation.map((item:Navigation) => (
                        <Link key={item.name} className="text-sm text-white/70 hover:text-white capitalize transition-colors" href={item.path}>
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Legal</h3>
                    <Link className="text-sm text-white/70 hover:text-white transition-colors" href="/legal/terms-conditions">Terms and conditions</Link>
                    <Link className="text-sm text-white/70 hover:text-white transition-colors" href="/legal/privacy">Privacy policy</Link>
                </div>

                <div className="flex flex-col items-center sm:items-start gap-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-white/40">Contact</h3>
                    <a className="text-sm text-white/70 hover:text-white transition-colors" href="mailto:ke1vin.kapustian@gmail.com?Subject=I would like to ask">
                        ke1vin.kapustian@gmail.com
                    </a>
                </div>
            </div>

            <div className="border-t border-white/10">
                <p className="max-w-7xl mx-auto px-5 sm:px-8 py-5 text-center text-xs text-white/50">
                    © {currentYear} Yevhenii Fit. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer
