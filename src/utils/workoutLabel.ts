const PUSH_MUSCLES = new Set(["Chest", "Shoulders", "Triceps"])
const PULL_MUSCLES = new Set(["Back", "Biceps"])
const LEG_MUSCLES = new Set(["Quads", "Hamstrings", "Calves", "Glutes"])

export const getWorkoutLabel = (muscleGroups: string[]): string => {
    if (muscleGroups.length === 0) return "Rest day"

    const hasPush = muscleGroups.some(m => PUSH_MUSCLES.has(m))
    const hasPull = muscleGroups.some(m => PULL_MUSCLES.has(m))
    const hasLegs = muscleGroups.some(m => LEG_MUSCLES.has(m))
    const categories = [hasPush && "Push", hasPull && "Pull", hasLegs && "Legs"].filter(Boolean) as string[]

    if (categories.length === 1) return categories[0]
    if (categories.length === 0) return muscleGroups.join(" · ")
    if (hasLegs) return "Full Body"
    return "Upper"
}
