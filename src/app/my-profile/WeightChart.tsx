'use client'

import { useMemo, useRef, useState } from "react"

type WeightPoint = {
    loggedAt: string
    weightKg: number
}

type WeightChartProps = {
    data: WeightPoint[]
}

const WIDTH = 640
const HEIGHT = 220
const PADDING_X = 12
const PADDING_TOP = 16
const PADDING_BOTTOM = 28

const niceStep = (range: number) => {
    const rough = range / 3
    const magnitude = Math.pow(10, Math.floor(Math.log10(rough || 1)))
    const normalized = rough / magnitude
    const step = normalized < 1.5 ? 1 : normalized < 3 ? 2 : normalized < 7 ? 5 : 10
    return step * magnitude
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })

const WeightChart = ({ data }: WeightChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null)
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)

    const { points, yTicks, minY, maxY } = useMemo(() => {
        const weights = data.map(d => d.weightKg)
        const rawMin = Math.min(...weights)
        const rawMax = Math.max(...weights)
        const step = niceStep(rawMax - rawMin || 1)
        const minY = Math.floor((rawMin - step * 0.5) / step) * step
        const maxY = Math.ceil((rawMax + step * 0.5) / step) * step

        const xFor = (index: number) => data.length === 1
            ? WIDTH / 2
            : PADDING_X + (index / (data.length - 1)) * (WIDTH - PADDING_X * 2)
        const yFor = (weight: number) => {
            const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM
            return PADDING_TOP + plotHeight - ((weight - minY) / (maxY - minY)) * plotHeight
        }

        const points = data.map((d, i) => ({ x: xFor(i), y: yFor(d.weightKg), ...d }))

        const yTicks: number[] = []
        for (let tick = minY; tick <= maxY; tick += step) yTicks.push(tick)

        return { points, yTicks, minY, maxY }
    }, [data])

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    const areaPath = points.length > 1
        ? `${linePath} L ${points[points.length - 1].x} ${HEIGHT - PADDING_BOTTOM} L ${points[0].x} ${HEIGHT - PADDING_BOTTOM} Z`
        : ""

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        const svg = svgRef.current
        if (!svg || points.length === 0) return

        const rect = svg.getBoundingClientRect()
        const relativeX = ((e.clientX - rect.left) / rect.width) * WIDTH

        let nearest = 0
        let nearestDist = Infinity
        points.forEach((p, i) => {
            const dist = Math.abs(p.x - relativeX)
            if (dist < nearestDist) {
                nearestDist = dist
                nearest = i
            }
        })
        setHoverIndex(nearest)
    }

    const hovered = hoverIndex !== null ? points[hoverIndex] : null
    const lastPoint = points[points.length - 1]

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-ink-strong/35">Weight</span>
                {lastPoint && (
                    <span className="text-sm font-semibold text-ink-strong">{lastPoint.weightKg} kg</span>
                )}
            </div>

            <svg
                ref={svgRef}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                preserveAspectRatio="none"
                className="h-72 w-full touch-none"
                onPointerMove={handlePointerMove}
                onPointerLeave={() => setHoverIndex(null)}
            >
                {yTicks.map(tick => {
                    const y = PADDING_TOP + (HEIGHT - PADDING_TOP - PADDING_BOTTOM) * (1 - (tick - minY) / (maxY - minY))
                    return (
                        <g key={tick}>
                            <line x1={PADDING_X} x2={WIDTH - PADDING_X} y1={y} y2={y} stroke="#e5e5e5" strokeWidth={1}/>
                            <text x={0} y={y - 4} fontSize={10} fill="#9a9a9a">{Math.round(tick)}</text>
                        </g>
                    )
                })}

                {areaPath && <path d={areaPath} fill="#1a1a1a" fillOpacity={0.06}/>}
                <path d={linePath} fill="none" stroke="#1a1a1a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>

                {points.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={4} fill="#1a1a1a" stroke="#fff" strokeWidth={2}/>
                ))}

                {hovered && (
                    <>
                        <line x1={hovered.x} x2={hovered.x} y1={PADDING_TOP} y2={HEIGHT - PADDING_BOTTOM} stroke="#c9c9c9" strokeWidth={1}/>
                        <circle cx={hovered.x} cy={hovered.y} r={6} fill="#1a1a1a" stroke="#fff" strokeWidth={2}/>
                    </>
                )}

                {points.map((p, i) => (
                    <text key={i} x={p.x} y={HEIGHT - 8} fontSize={10} fill="#9a9a9a" textAnchor="middle">
                        {i === hoverIndex || i === points.length - 1 || i === 0 ? formatDate(p.loggedAt) : ""}
                    </text>
                ))}
            </svg>

            {hovered && (
                <div className="self-start rounded-lg border border-black/10 bg-white px-3 py-1.5 text-xs shadow-sm">
                    <span className="font-semibold text-ink-strong">{hovered.weightKg} kg</span>
                    <span className="ml-1.5 text-ink-strong/50">{formatDate(hovered.loggedAt)}</span>
                </div>
            )}
        </div>
    )
}

export default WeightChart
