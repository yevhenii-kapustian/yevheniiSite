'use client'

import { navigation, Navigation } from "@/data/navigation";
import Logo from "../Logo";

const Header = () => {
    return(
        <header className="flex justify-around items-center bg-black">
            <nav>
                <ul className="text-white flex gap-10">
                    {navigation.map((item:Navigation) => <li key={item.name}><a href={item.path}>{item.name.toUpperCase()}</a></li> )}
                </ul> 
            </nav>
            <div>
                <Logo/>
            </div>
        </header>
    )
}

export default Header