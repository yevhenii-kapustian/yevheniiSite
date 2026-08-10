import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerAuthClient } from "@/supabase/server-client"
import {
    getBodyLogHistory,
    getEntitlementsForUser,
    getIntakeHistory,
    getLatestNutritionTarget,
    getTrainingPlanWithExercises,
    getWorkoutHistory,
} from "@/supabase/queries"
import { weightDelta, weightReportSentence } from "@/utils/weightReport"
import { getPersonalRecords, getVolumeTrendSentence, getWeeklyVolume, getWorkoutDaysThisWeek } from "@/utils/trainingReport"
import ProgressContent from "./ProgressContent"

export const metadata: Metadata = {
    title: "Your Progress - Yevhenii Fit",
}

export default async function ProgressPage () {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const entitlements = await getEntitlementsForUser(user.id)
    const hasTraining = entitlements.some(e => e.module === "training" && e.status === "active")
    const hasNutrition = entitlements.some(e => e.module === "nutrition" && e.status === "active")

    const [history, workoutHistory, intakeHistory, nutritionTarget, planByDay] = await Promise.all([
        getBodyLogHistory(user.id),
        hasTraining ? getWorkoutHistory(user.id) : Promise.resolve([]),
        hasNutrition ? getIntakeHistory(user.id) : Promise.resolve([]),
        hasNutrition ? getLatestNutritionTarget(user.id) : Promise.resolve(null),
        hasTraining ? getTrainingPlanWithExercises(user.id) : Promise.resolve(new Map()),
    ])

    const weightHistory = history.map(w => ({ loggedAt: w.logged_at, weightKg: w.weight_kg }))
    const delta = weightDelta(weightHistory)

    const weeklyVolume = getWeeklyVolume(workoutHistory)
    const personalRecords = getPersonalRecords(workoutHistory)
    const workoutDaysThisWeek = getWorkoutDaysThisWeek(workoutHistory)
    const plannedDaysThisWeek = Array.from(planByDay.values()).filter(exercises => exercises.length > 0).length

    const nutritionTargetCalories = nutritionTarget?.calories ?? 0

    const exerciseOptions = Array.from(planByDay.values())
        .flat()
        .map(exercise => ({ planExerciseId: exercise.planExerciseId, name: exercise.name }))

    return (
        <div className="flex flex-col gap-8">
            <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Your progress</h1>

            <ProgressContent
                hasTraining={hasTraining}
                hasNutrition={hasNutrition}
                weightHistory={weightHistory}
                weightDelta={delta}
                weightReport={weightReportSentence(weightHistory)}
                weeklyVolume={weeklyVolume}
                volumeTrend={getVolumeTrendSentence(weeklyVolume)}
                personalRecords={personalRecords}
                exerciseOptions={exerciseOptions}
                workoutDaysThisWeek={workoutDaysThisWeek}
                plannedDaysThisWeek={plannedDaysThisWeek}
                intakeHistory={intakeHistory}
                nutritionTargetCalories={nutritionTargetCalories}
            />
        </div>
    )
}
