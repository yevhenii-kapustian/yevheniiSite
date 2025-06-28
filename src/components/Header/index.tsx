'use client'

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation, Navigation } from "@/data/navigation";
import Logo from "../Logo";
import { desktopStyles, burgerMenuStyles, mobileStyles } from "./styles";

const ScrollY:number = 300;

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const pathname = usePathname();
    const isHome = pathname === "/"

    const toggleMobileMenu = ():void => {
        setMobileOpen(!mobileOpen)
    }
    
    useLayoutEffect(() => {
        const handleScroll = ():void => {
            setIsScrolled(window.scrollY >= ScrollY)
        }
        handleScroll()

        document.addEventListener('scroll', handleScroll);
        
        return () => {
            document.removeEventListener('scroll', handleScroll);
          };
    }, [])
    
    const navigationStyles = ():string => {
        const isHomeStyles = isHome ? "" : "bg-black"
        const isScrolledStyles = isScrolled ? "bg-black" : ""

        return `${isHomeStyles} ${isScrolledStyles}`
    }

    return(
        <header className={`${navigationStyles()} w-full fixed flex justify-around items-center z-10 duration-300 ease-in-out`}>
            <div className="w-20">
                <Logo/>
            </div>

            <nav>
                <div className={desktopStyles}>
                    {navigation.map((item:Navigation) => <Link key={item.name} href={item.path}>{item.name.toUpperCase()}</Link>)}
                </div>

                 <div className={burgerMenuStyles}>
                    <button onClick={toggleMobileMenu} className="w-[35px] h-[35px]">
                        <div className="grid flex-col justify-items-center gap-1.5">
                            <span className={`h-[3px] w-8 rounded-full bg-white duration-300 ease-in-out ${mobileOpen ? 'rotate-45 translate-y-2.5' : ''}`}/>
                            <span className={`h-[3px] w-8 rounded-full bg-white duration-300 ease-in ${mobileOpen ? 'scale-x-0' : ''}`}/>
                            <span className={`h-[3px] w-8 rounded-full bg-white duration-300 ease-in-out ${mobileOpen ? '-rotate-45 -translate-y-2' : ""}`}/>
                        </div>
                    </button>
                </div>
 
                <ul className={`${mobileStyles}
                                ${navigationStyles()} 
                                duration-300 ease-in-out
                                ${!mobileOpen ? "opacity-0" : "opacity-100"}
                                `}>
                    {navigation.map((item:Navigation) => (
                        <li key={item.name}>
                            <Link onClick={() => setMobileOpen(false)} href={item.path}>{item.name.toUpperCase()}</Link>
                        </li>)
                    )}
                </ul>
            </nav>
        </header>
    )
}

export default Header