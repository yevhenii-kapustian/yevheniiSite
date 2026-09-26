// `<date>.toISOString().slice(0, 10)` — used all over this codebase to turn a Date into
// YYYY-MM-DD — actually reads the date in UTC, not local time. This isn't only wrong for
// "the current moment": it's wrong for ANY Date object built from local components too.
// A Date constructed as local midnight on, say, Aug 26 (`new Date("2026-08-26T00:00:00")`)
// IS Aug 26 locally no matter what time of day this code runs — but for anyone in a
// timezone ahead of UTC (e.g. Ukraine, UTC+2/+3), .toISOString() converts that same instant
// to UTC, which lands a few hours EARLIER, on Aug 25. So this doesn't just misfire near
// midnight — every single date built this way is permanently off by one day, all day,
// every day, for as long as the offset holds. This reads local date components instead,
// matching what a person actually means by a given calendar day wherever the server runs.
export const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export const getTodayLocalDate = (): string => toLocalDateString(new Date())
