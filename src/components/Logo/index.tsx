'use client'

import Image from "next/image"

const Logo = () => {
    return(
        <a href="/"><Image src="/logo-site.png"
                            alt="logo" 
                            width={1000}  
                            height={1000} 
                            priority 
                    />
        </a>
    )
}

export default Logo