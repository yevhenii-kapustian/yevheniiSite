import type { Metadata } from "next"
import TransformContent from "./TransformContent"

export const metadata: Metadata = {
    title: "Visualize Your Transformation - Yevhenii Fit",
    description: "Enter your stats and drag the slider to see the physique you're aiming for — plus the exact calories and program it takes to get there.",
}

const Transform = () => {
    return <TransformContent/>
}

export default Transform
