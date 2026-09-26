import { NextRequest, NextResponse } from "next/server";
import { searchHealthyRecipes } from "@/lib/spoonacular";
import { upsertRecipe } from "@/supabase/queries";
import { parseJsonBody } from "@/lib/parseJsonBody";

// Not linked from any page a site visitor can reach — this is the ONLY path that ever
// spends Spoonacular quota, and it's meant to be called by hand (curl/Postman) whenever
// the operator decides to top up the recipe cache, not wired into any UI button that could
// get clicked repeatedly by accident.
const MAX_PER_CALL = 20

export async function POST(req: NextRequest) {
    const secret = req.headers.get("x-admin-secret")
    if (!secret || !process.env.ADMIN_SYNC_SECRET || secret !== process.env.ADMIN_SYNC_SECRET) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data: body, error: parseError } = await parseJsonBody<{ query?: unknown, number?: unknown, minProtein?: unknown, minCalories?: unknown, maxCalories?: unknown }>(req)
    if (parseError) return parseError

    const query = typeof body.query === "string" && body.query.trim() ? body.query.trim() : undefined
    const requestedNumber = Number(body.number)
    const number = Number.isFinite(requestedNumber) ? Math.min(Math.max(Math.round(requestedNumber), 1), MAX_PER_CALL) : 10

    const toPositiveNumber = (value: unknown): number | undefined => {
        const num = Number(value)
        return Number.isFinite(num) && num > 0 ? num : undefined
    }

    let result
    try {
        result = await searchHealthyRecipes(query, number, {
            minProtein: toPositiveNumber(body.minProtein),
            minCalories: toPositiveNumber(body.minCalories),
            maxCalories: toPositiveNumber(body.maxCalories),
        })
    } catch (error) {
        console.error("Spoonacular sync failed:", error)
        return NextResponse.json({ message: error instanceof Error ? error.message : "Sync failed" }, { status: 502 })
    }

    for (const recipe of result.recipes) {
        await upsertRecipe({
            external_id: recipe.externalId,
            title: recipe.title,
            image_url: recipe.imageUrl,
            servings: recipe.servings,
            calories: recipe.calories,
            protein_g: recipe.proteinG,
            fat_g: recipe.fatG,
            carbs_g: recipe.carbsG,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            source_url: recipe.sourceUrl,
        })
    }

    return NextResponse.json({
        message: "Success",
        synced: result.recipes.length,
        found: result.rawCount,
        skipped: result.skippedCount,
    })
}
