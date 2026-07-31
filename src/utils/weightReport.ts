type WeightPoint = {
    loggedAt: string
    weightKg: number
}

export const weightDelta = (history: WeightPoint[]) => {
    if (history.length < 2) return null

    const first = history[0]
    const last = history[history.length - 1]
    const days = Math.round((new Date(last.loggedAt).getTime() - new Date(first.loggedAt).getTime()) / 86_400_000)
    const change = last.weightKg - first.weightKg

    return { days, change, current: last.weightKg }
}

export const weightReportSentence = (history: WeightPoint[]) => {
    const delta = weightDelta(history)
    if (!delta) return null

    const { days, change } = delta
    if (Math.abs(change) < 0.1) return "Your weight has held steady over this period."

    const weeks = Math.max(days / 7, 1)
    const perWeek = Math.abs(change / weeks)
    const direction = change < 0 ? "down" : "up"
    return `You're ${direction} ${Math.abs(change).toFixed(1)}kg over ${days} days — about ${perWeek.toFixed(1)}kg per week.`
}

export const weightReportShort = (history: WeightPoint[]) => {
    const delta = weightDelta(history)
    if (!delta) return null

    const { days, change } = delta
    if (Math.abs(change) < 0.1) return "Steady over the last " + days + " days"

    const direction = change < 0 ? "-" : "+"
    return `${direction}${Math.abs(change).toFixed(1)}kg over ${days} days`
}
