'use client'

import Logo from "../Logo"
import { InstagramLogo, EnvelopeSimple } from "@phosphor-icons/react"

const Footer = () => {
    const currentTime = new Date().getFullYear()

    return(
        <footer className="p-5 flex flex-col items-center gap-5 bg-black">
            <div className="w-30">
                <Logo/>
            </div>
            <div className="flex gap-3">
                <a href="mailto:ke1vin.kapustian@gmail.com?Subject=I would like to ask" target="_top"><EnvelopeSimple color="white" size={32} /></a>
                <a target="_blank" href="https://www.instagram.com/_ev_ge_niii_/"><InstagramLogo color="white" size={32} /></a>
            </div>
            <div className="flex flex-col gap-4">
                <p className="text-white font-thin">© {currentTime} Copyright. Yevhenii. All rights reserved.</p>
                <div className="text-center">
                    <a className="text-white" href="/legal/terms-conditions">Terms and conditions</a>
                    <span className="text-white">|</span>
                    <a className="text-white" href="/legal/privacy">Privacy policy</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer