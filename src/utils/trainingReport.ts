type WorkoutLogRow = {
    logId: number
    performedAt: string
    exerciseName: string
    actualReps: number
    actualWeightKg: number
}

const getISOWeekStart = (dateStr: string) => {
    const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`)
    const weekday = (d.getDay() + 6) % 7 // Monday = 0
    d.setDate(d.getDate() - weekday)
    return d.toISOString().slice(0, 10)
}

export type WeeklyVolumePoint = {
    weekStart: string
    volumeKg: number
}

export const getWeeklyVolume = (logs: WorkoutLogRow[], weeks = 8): WeeklyVolumePoint[] => {
    const volumeByWeek = new Map<string, number>()

    for (const log of logs) {
        const weekStart = getISOWeekStart(log.performedAt)
        const volume = log.actualReps * log.actualWeightKg
        volumeByWeek.set(weekStart, (volumeByWeek.get(weekStart) ?? 0) + volume)
    }

    const sortedWeeks = Array.from(volumeByWeek.keys()).sort()
    const recentWeeks = sortedWeeks.slice(-weeks)

    return recentWeeks.map(weekStart => ({ weekStart, volumeKg: Math.round(volumeByWeek.get(weekStart)!) }))
}

export type PersonalRecord = {
    logId: number
    exerciseName: string
    weightKg: number
    reps: number
    performedAt: string
}

export const getPersonalRecords = (logs: WorkoutLogRow[], limit = 5): PersonalRecord[] => {
    const bestByExercise = new Map<string, PersonalRecord>()

    for (const log of logs) {
        const current = bestByExercise.get(log.exerciseName)
        const isBetter = !current
            || log.actualWeightKg > current.weightKg
            || (log.actualWeightKg === current.weightKg && log.actualReps > current.reps)

        if (isBetter) {
            bestByExercise.set(log.exerciseName, {
                logId: log.logId,
                exerciseName: log.exerciseName,
                weightKg: log.actualWeightKg,
                reps: log.actualReps,
                performedAt: log.performedAt,
            })
        }
    }

    return Array.from(bestByExercise.values())
        .sort((a, b) => b.weightKg - a.weightKg)
        .slice(0, limit)
}

export const getWorkoutDaysThisWeek = (logs: WorkoutLogRow[]): number => {
    const thisWeekStart = getISOWeekStart(new Date().toISOString())
    const days = new Set(
        logs
            .filter(log => getISOWeekStart(log.performedAt) === thisWeekStart)
            .map(log => log.performedAt.slice(0, 10))
    )
    return days.size
}

export const getVolumeTrendSentence = (points: WeeklyVolumePoint[]): string | null => {
    if (points.length < 2) return null

    const last = points[points.length - 1]
    const prev = points[points.length - 2]
    if (prev.volumeKg === 0) return null

    const changePct = Math.round(((last.volumeKg - prev.volumeKg) / prev.volumeKg) * 100)
    if (Math.abs(changePct) < 3) return "Your training volume has held steady week over week."

    const direction = changePct > 0 ? "up" : "down"
    return `Your training volume is ${direction} ${Math.abs(changePct)}% versus last week.`
}
