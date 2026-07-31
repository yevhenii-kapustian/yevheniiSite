type WeightSparklineProps = {
    data: { loggedAt: string, weightKg: number }[]
    className?: string
}

const WIDTH = 240
const HEIGHT = 48

const WeightSparkline = ({ data, className = "text-ink-strong" }: WeightSparklineProps) => {
    if (data.length < 2) return null

    const weights = data.map(d => d.weightKg)
    const min = Math.min(...weights)
    const max = Math.max(...weights)
    const range = max - min || 1

    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * WIDTH
        const y = HEIGHT - ((d.weightKg - min) / range) * HEIGHT
        return `${x},${y}`
    }).join(" ")

    return (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className={`h-12 w-full ${className}`}>
            <polyline points={points} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    )
}

export default WeightSparkline
