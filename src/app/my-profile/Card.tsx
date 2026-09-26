type CardProps = { children: React.ReactNode, className?: string, glass?: boolean }

const Card = ({ children, className = "", glass = false }: CardProps) => (
    <div className={`card-shadow rounded-[28px] border ${glass ? "nav-blur border-white/40 bg-white/55" : "border-black/[0.05] bg-white"} ${className}`}>
        {children}
    </div>
)

export const CardIcon = ({ children }: { children: React.ReactNode }) => (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/60">
        {children}
    </span>
)

export const CardLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-strong/35">{children}</span>
)

export default Card
