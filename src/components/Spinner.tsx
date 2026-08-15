import { CircleNotch } from "@phosphor-icons/react"

const Spinner = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
    <CircleNotch size={size} weight="bold" className={`animate-spin ${className}`}/>
)

export default Spinner
