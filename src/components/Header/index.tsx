'use client'

import { useLayoutEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation, Navigation } from "@/data/navigation";
import Logo from "../Logo";
import { desktopStyles, burgerMenuStyles, mobileStyles } from "./styles";
import { List, X } from "@phosphor-icons/react";

const ScrollY = 300;

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

    console.log(isScrolled);
    
    const headerStyles = ():string => {
        const basicStyles = "w-full fixed flex justify-around items-center z-10 duration-300 ease-in-out"
        const isHomeStyles = isHome ? "" : "bg-black"
        const isScrolledStyles = isScrolled ? "bg-black" : ""

        return `${basicStyles} ${isHomeStyles} ${isScrolledStyles}`
    }

    return(
        <header className={headerStyles()}>
            <div>
                <Logo/>
            </div>

            <nav>
                <div className={desktopStyles}>
                    {navigation.map((item:Navigation) => <Link key={item.name} href={item.path}>{item.name.toUpperCase()}</Link>)}
                </div>

                <div className={burgerMenuStyles}>
                    <button onClick={toggleMobileMenu}>
                        {!mobileOpen ? <List className="cursor-pointer" size={32} color="white"/> : <X className="cursor-pointer" size={32} color="white"/>}
                    </button>
                </div>

                {mobileOpen && 
                    <ul className={mobileStyles}>
                        {navigation.map((item:Navigation) => (
                            <li key={item.name}>
                                <Link onClick={() => setMobileOpen(false)} href={item.path}>{item.name.toUpperCase()}</Link>
                            </li>)
                        )}
                    </ul>
                }
            </nav>
        </header>
    )
}

export default Header