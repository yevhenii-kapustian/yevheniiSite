export const characterEdgeStyle = { filter: "url(#home2-character-edges)" } as const

export default function CharacterEdgeFilter() {
    return (
        <svg
            className="pointer-events-none absolute h-0 w-0"
            aria-hidden="true"
            focusable="false"
        >
            <defs>
                <filter
                    id="home2-character-edges"
                    x="-1%"
                    y="-1%"
                    width="102%"
                    height="102%"
                    primitiveUnits="objectBoundingBox"
                    colorInterpolationFilters="sRGB"
                >
                    {/* Trim the keyed fringe, then soften only coverage, not the RGB image. */}
                    <feMorphology in="SourceAlpha" operator="erode" radius="0.0006" result="insetAlpha" />
                    <feGaussianBlur in="insetAlpha" stdDeviation="0.00045" result="softAlpha" />
                    <feComponentTransfer in="softAlpha" result="cleanAlpha">
                        <feFuncA type="linear" slope="1.1" intercept="-0.05" />
                    </feComponentTransfer>
                    <feComposite in="SourceGraphic" in2="cleanAlpha" operator="in" />
                </filter>
            </defs>
        </svg>
    )
}
