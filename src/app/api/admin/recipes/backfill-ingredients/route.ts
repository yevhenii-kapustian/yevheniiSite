import { NextRequest, NextResponse } from "next/server";
import { getRecipeIngredients } from "@/lib/spoonacular";
import { getRecipesMissingIngredients, updateRecipeIngredients } from "@/supabase/queries";

// Same protection and "never linked from a normal page" pattern as the main sync route —
// this is the targeted fix-up for recipes saved before fillIngredients=true existed,
// processed a handful at a time so a single click can't run away with the daily quota.
const MAX_PER_CALL = 20

export async function POST(req: NextRequest) {
    const secret = req.headers.get("x-admin-secret")
    if (!secret || !process.env.ADMIN_SYNC_SECRET || secret !== process.env.ADMIN_SYNC_SECRET) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const recipes = await getRecipesMissingIngredients(MAX_PER_CALL)

    let updated = 0
    let failed = 0
    let firstError: string | null = null
    for (const recipe of recipes) {
        try {
            const ingredients = await getRecipeIngredients(recipe.external_id)
            if (ingredients) {
                await updateRecipeIngredients(recipe.id, ingredients)
                updated++
            } else {
                failed++
                firstError ??= "Spoonacular returned an empty ingredient list for this recipe"
            }
        } catch (error) {
            console.error(`Failed to backfill ingredients for recipe ${recipe.id}:`, error)
            failed++
            firstError ??= error instanceof Error ? error.message : "Unknown error"
        }
    }

    return NextResponse.json({ message: "Success", checked: recipes.length, updated, failed, firstError })
}
