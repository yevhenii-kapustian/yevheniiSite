import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { CaretLeft } from "@phosphor-icons/react/dist/ssr"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getRecipeById } from "@/supabase/queries"
import Card from "../../../Card"
import LogRecipeButton from "./LogRecipeButton"
import RecipeHero from "./RecipeHero"

type PageProps = {
    params: Promise<{ id: string }>
}

export async function generateMetadata ({ params }: PageProps): Promise<Metadata> {
    const { id } = await params
    const recipe = Number.isInteger(Number(id)) ? await getRecipeById(Number(id)) : null
    return { title: recipe ? `${recipe.title} - Yevhenii Fit` : "Recipe - Yevhenii Fit" }
}

export default async function RecipeDetailPage ({ params }: PageProps) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/get-started")
    }

    const entitlements = await getEntitlementsForUser(user.id)
    const hasNutrition = entitlements.some(e => e.module === "nutrition" && e.status === "active")

    if (!hasNutrition) {
        redirect("/my-profile/nutrition")
    }

    const { id } = await params
    const idNum = Number(id)
    if (!Number.isInteger(idNum)) notFound()

    const recipe = await getRecipeById(idNum)
    if (!recipe) notFound()

    return (
        <div className="flex flex-col gap-6">
            <Link href="/my-profile/nutrition/recipes" className="flex w-fit items-center gap-1.5 text-sm text-ink-strong/50 hover:text-ink-strong">
                <CaretLeft size={14} weight="bold"/> All recipes
            </Link>

            <RecipeHero
                title={recipe.title}
                imageUrl={recipe.image_url}
                calories={recipe.calories}
                proteinG={recipe.protein_g}
                fatG={recipe.fat_g}
                carbsG={recipe.carbs_g}
                servings={recipe.servings}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="flex flex-col gap-6">
                    <LogRecipeButton
                        name={recipe.title}
                        calories={recipe.calories}
                        proteinG={recipe.protein_g}
                        fatG={recipe.fat_g}
                        carbsG={recipe.carbs_g}
                    />

                    <Card glass className="flex flex-col gap-3 p-5 sm:p-6">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">Ingredients</span>
                        <ul className="flex flex-col gap-1.5 text-sm leading-relaxed text-ink-strong/70">
                            {recipe.ingredients.split("\n").filter(Boolean).map((ingredient, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="shrink-0 text-ink-strong/30">•</span>
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                <div className="flex flex-col gap-6">
                    <Card glass className="flex flex-col gap-3 p-5 sm:p-6">
                        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink-strong/35">How to make it</span>
                        <ol className="flex flex-col gap-2 text-sm leading-relaxed text-ink-strong/70">
                            {recipe.instructions.split("\n").filter(Boolean).map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </Card>

                    {recipe.source_url && (
                        <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-strong/40 hover:text-ink-strong/70">
                            Original recipe source ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
