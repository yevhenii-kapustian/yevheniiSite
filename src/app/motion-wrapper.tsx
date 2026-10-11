'use client'

import { ReactNode } from "react";
import Reveal from "@/components/animation/Reveal";

export default function LayoutWrapperMotion ({children}: {children:ReactNode }) {
    return(
        <Reveal as="section" y={-50} duration={0.5}>
            {children}
        </Reveal>
    )
}
