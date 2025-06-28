import Image from "next/image"

import { ImageStyles } from "./styles"

const WelcomeSection = () => {
    return(
        <section>
            <div className="relative flex justify-center w-full">
                <Image className={`${ImageStyles}`} src="/welcomeSection.jpg" alt="" width={2000} height={2000} priority/>
            </div>
        </section>
    )
}

export default WelcomeSection