import ProfileNav from "./ProfileNav"

export default function MyProfileLayout ({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col">
            <ProfileNav/>
            {children}
        </div>
    )
}
