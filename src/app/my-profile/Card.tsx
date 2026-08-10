const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`card-shadow rounded-[28px] border border-black/[0.05] bg-white ${className}`}>
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
