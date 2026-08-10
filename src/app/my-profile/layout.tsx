import ProfileNav from "./ProfileNav"

export default function MyProfileLayout ({ children }: { children: React.ReactNode }) {
    return (
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-10 lg:flex-row lg:gap-12 lg:px-20 lg:py-14">
            <ProfileNav/>
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    )
}
