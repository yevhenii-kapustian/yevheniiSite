'use client'

import Image from "next/image"
import Link from "next/link"

const Logo = () => {
    return(
        <Link href="/"><Image src="/logo-site.png"
                            alt="logo"
                            width={1000}
                            height={1000}
                            priority
                    />
        </Link>
    )
}

export default Logo