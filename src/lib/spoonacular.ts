// Thin wrapper around Spoonacular's REST API. Every call here costs "points" against a
// metered daily free-tier quota — this file is ONLY ever called from the manually-triggered
// sync route (src/app/api/admin/recipes/sync/route.ts), never from a page a normal site
// visitor can load, so quota usage is fully under the operator's control.
const BASE_URL = "https://api.spoonacular.com"

type SpoonacularNutrient = { name: string, amount: number, unit: string }

type SpoonacularRecipe = {
    id: number
    title: string
    image?: string
    servings: number
    sourceUrl?: string
    extendedIngredients?: { original: string }[]
    analyzedInstructions?: { steps: { number: number, step: string }[] }[]
    nutrition?: { nutrients: SpoonacularNutrient[] }
}

export type NormalizedRecipe = {
    externalId: string
    title: string
    imageUrl: string | null
    servings: number
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
    ingredients: string
    instructions: string
    sourceUrl: string | null
}

const getNutrient = (nutrients: SpoonacularNutrient[] | undefined, name: string): number =>
    Math.round(nutrients?.find(n => n.name === name)?.amount ?? 0)

const normalize = (recipe: SpoonacularRecipe): NormalizedRecipe => ({
    externalId: String(recipe.id),
    title: recipe.title,
    imageUrl: recipe.image ?? null,
    servings: recipe.servings || 1,
    calories: getNutrient(recipe.nutrition?.nutrients, "Calories"),
    proteinG: getNutrient(recipe.nutrition?.nutrients, "Protein"),
    fatG: getNutrient(recipe.nutrition?.nutrients, "Fat"),
    carbsG: getNutrient(recipe.nutrition?.nutrients, "Carbohydrates"),
    ingredients: (recipe.extendedIngredients ?? []).map(i => i.original).join("\n"),
    instructions: (recipe.analyzedInstructions?.[0]?.steps ?? []).map(s => `${s.number}. ${s.step}`).join("\n"),
    sourceUrl: recipe.sourceUrl ?? null,
})

export type SearchResult = { recipes: NormalizedRecipe[], rawCount: number, skippedCount: number }

export type NutrientFilters = {
    minProtein?: number
    minCalories?: number
    maxCalories?: number
}

// One complexSearch call with addRecipeNutrition=true + addRecipeInformation=true returns
// full ingredients, instructions, and nutrition for every result in a single request —
// deliberately using this instead of a cheap search + a separate "recipe information" call
// per result, since that would multiply the point cost by however many recipes are fetched.
// (addRecipeInformation is the parameter that actually includes analyzedInstructions/
// extendedIngredients/sourceUrl in complexSearch results — addRecipeInstructions, used
// here previously, isn't a real Spoonacular param, so it was silently ignored and every
// result came back with no analyzedInstructions to filter on.)
//
// `query` is a plain text match against recipe titles/text — it's NOT a nutrition filter,
// so phrases like "high calorie high protein" reliably return zero results (no recipe is
// literally titled that). Nutrition targeting belongs in `nutrients` instead, which maps to
// Spoonacular's real minProtein/minCalories/maxCalories range filters — `query` should only
// ever carry the food/meal type itself ("breakfast", "chicken", "salad", ...).
export const searchHealthyRecipes = async (query: string | undefined, number: number, nutrients: NutrientFilters = {}): Promise<SearchResult> => {
    const apiKey = process.env.SPOONACULAR_API_KEY
    if (!apiKey) throw new Error("SPOONACULAR_API_KEY is not set")

    const params = new URLSearchParams({
        apiKey,
        number: String(number),
        addRecipeNutrition: "true",
        addRecipeInformation: "true",
        fillIngredients: "true",
        instructionsRequired: "true",
        sort: "healthiness",
    })
    if (query) params.set("query", query)
    if (nutrients.minProtein) params.set("minProtein", String(nutrients.minProtein))
    if (nutrients.minCalories) params.set("minCalories", String(nutrients.minCalories))
    if (nutrients.maxCalories) params.set("maxCalories", String(nutrients.maxCalories))

    const res = await fetch(`${BASE_URL}/recipes/complexSearch?${params.toString()}`)
    const rawBody = await res.text()

    if (!res.ok) {
        throw new Error(`Spoonacular search failed (${res.status}): ${rawBody}`)
    }

    let data: { results: SpoonacularRecipe[], totalResults?: number }
    try {
        data = JSON.parse(rawBody)
    } catch {
        throw new Error(`Spoonacular returned a non-JSON response: ${rawBody.slice(0, 300)}`)
    }

    const results = data.results ?? []
    const usable = results.filter(r => r.nutrition && r.analyzedInstructions?.[0]?.steps?.length)
    return {
        recipes: usable.map(normalize),
        rawCount: results.length,
        skippedCount: results.length - usable.length,
    }
}

// Targeted, per-recipe fetch — used to backfill ingredients for recipes already saved
// (from before fillIngredients=true was added to the search call) without re-running a
// full complexSearch, which would spend quota re-fetching recipes that are already fine
// and isn't even guaranteed to surface the same set of recipes again.
export const getRecipeIngredients = async (externalId: string): Promise<string> => {
    const apiKey = process.env.SPOONACULAR_API_KEY
    if (!apiKey) throw new Error("SPOONACULAR_API_KEY is not set")

    const res = await fetch(`${BASE_URL}/recipes/${externalId}/information?apiKey=${apiKey}&includeNutrition=false`)
    if (!res.ok) {
        const body = await res.text().catch(() => "")
        throw new Error(`Spoonacular recipe information failed (${res.status}): ${body}`)
    }

    const data: { extendedIngredients?: { original: string }[] } = await res.json()
    return (data.extendedIngredients ?? []).map(i => i.original).join("\n")
}
