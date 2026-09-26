type SetupProfile = {
    gender?: string | null
    age?: number | null
    height_cm?: number | null
    goal?: string | null
    activity_level?: string | null
    experience?: string | null
    days_per_week?: string | null
    equipment?: string | null
} | null

export const isProfileSetupComplete = (profile: SetupProfile, weightKg: number | null) =>
    Boolean(
        profile?.gender
        && profile.age
        && profile.height_cm
        && profile.goal
        && profile.activity_level
        && profile.experience
        && profile.days_per_week
        && profile.equipment
        && weightKg
    )
