import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";

type FoodResult = {
    name: string
    calories: number
    proteinG: number
    fatG: number
    carbsG: number
}

export async function GET(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const query = req.nextUrl.searchParams.get("q")?.trim()
    if (!query) {
        return NextResponse.json({ results: [] })
    }

    const appId = process.env.EDAMAM_APP_ID
    const appKey = process.env.EDAMAM_APP_KEY

    if (!appId || !appKey) {
        // Food search isn't configured yet — fail soft so manual entry still works.
        return NextResponse.json({ results: [] })
    }

    // Free-tier Edamam access only covers the Nutrition Analysis (natural language)
    // endpoint, not the Food Database search API — this takes a single "<quantity>
    // <food>" phrase (e.g. "200g grilled chicken breast") and returns its nutrients,
    // rather than a list of matching dishes to pick from.
    const url = new URL("https://api.edamam.com/api/nutrition-data")
    url.searchParams.set("app_id", appId)
    url.searchParams.set("app_key", appKey)
    url.searchParams.set("ingr", query)

    const response = await fetch(url.toString())
    if (!response.ok) {
        return NextResponse.json({ results: [] })
    }

    const data = await response.json()
    const parsed = data.ingredients?.[0]?.parsed?.[0]
    if (!parsed) {
        return NextResponse.json({ results: [] })
    }

    const nutrients = parsed.nutrients ?? {}
    const result: FoodResult = {
        name: parsed.food ?? query,
        calories: Math.round(nutrients.ENERC_KCAL?.quantity ?? 0),
        proteinG: Math.round(nutrients.PROCNT?.quantity ?? 0),
        fatG: Math.round(nutrients.FAT?.quantity ?? 0),
        carbsG: Math.round(nutrients.CHOCDF?.quantity ?? 0),
    }

    if (result.calories === 0) {
        return NextResponse.json({ results: [] })
    }

    return NextResponse.json({ results: [result] })
}
