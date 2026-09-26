import type { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CaretLeft, CaretRight, Fire, ForkKnife } from "@phosphor-icons/react/dist/ssr"
import { getServerAuthClient } from "@/supabase/server-client"
import { getEntitlementsForUser, getRecipes, RECIPES_PAGE_SIZE, type RecipeSort } from "@/supabase/queries"
import Card from "../../Card"
import RecipeFilters from "./RecipeFilters"

export const metadata: Metadata = {
    title: "Recipes - Yevhenii Fit",
}

const VALID_SORTS: RecipeSort[] = ["title", "calories_asc", "calories_desc", "protein_desc", "newest"]

type PageProps = {
    searchParams: Promise<{ search?: string, minProtein?: string, maxCalories?: string, sort?: string, page?: string }>
}

export default async function RecipesPage ({ searchParams }: PageProps) {
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

    const { search, minProtein, maxCalories, sort, page } = await searchParams
    const currentPage = page && Number(page) > 0 ? Number(page) : 1
    const { recipes, totalCount } = await getRecipes({
        search: search?.trim() || undefined,
        minProtein: minProtein ? Number(minProtein) : undefined,
        maxCalories: maxCalories ? Number(maxCalories) : undefined,
        sort: sort && VALID_SORTS.includes(sort as RecipeSort) ? (sort as RecipeSort) : undefined,
        page: currentPage,
    })

    const hasActiveFilters = Boolean(search || minProtein || maxCalories)
    const totalPages = Math.max(1, Math.ceil(totalCount / RECIPES_PAGE_SIZE))

    // Only spotlight a hero recipe on a clean, unfiltered first page — a "Featured recipe"
    // banner promoting whatever happened to sort first under an active search/filter would
    // misleadingly read as a curated pick rather than just this result set's top row.
    const showFeatured = currentPage === 1 && !hasActiveFilters && recipes.length >= 3
    const featured = showFeatured ? recipes[0] : null
    const gridRecipes = showFeatured ? recipes.slice(1) : recipes

    const pageHref = (targetPage: number) => {
        const params = new URLSearchParams()
        if (search) params.set("search", search)
        if (minProtein) params.set("minProtein", minProtein)
        if (maxCalories) params.set("maxCalories", maxCalories)
        if (sort) params.set("sort", sort)
        if (targetPage > 1) params.set("page", String(targetPage))
        const query = params.toString()
        return `/my-profile/nutrition/recipes${query ? `?${query}` : ""}`
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                            <ForkKnife size={16} weight="bold"/>
                        </span>
                        <h1 className="text-3xl font-semibold tracking-tight text-ink-strong sm:text-4xl">Recipes</h1>
                    </div>
                    <p className="text-sm text-ink-strong/50">Healthy meal ideas with the calories and macros already worked out.</p>
                </div>
                {totalCount > 0 && (
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-strong/35">
                        {totalCount.toLocaleString("en-US")} recipe{totalCount === 1 ? "" : "s"}
                    </span>
                )}
            </div>

            <RecipeFilters
                search={search ?? ""}
                minProtein={minProtein ?? ""}
                maxCalories={maxCalories ?? ""}
                sort={sort && VALID_SORTS.includes(sort as RecipeSort) ? sort : "title"}
            />

            {recipes.length === 0 ? (
                <Card className="flex flex-col items-center gap-2 p-10 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.04] text-ink-strong/40">
                        <ForkKnife size={18} weight="bold"/>
                    </span>
                    <p className="text-sm text-ink-strong/50">
                        {hasActiveFilters ? "No recipes match these filters." : "No recipes yet — check back soon."}
                    </p>
                </Card>
            ) : (
                <div className="flex flex-col gap-5">
                    {featured && (
                        <Link href={`/my-profile/nutrition/recipes/${featured.id}`}>
                            <Card className="group relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
                                {featured.image_url && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={featured.image_url}
                                        alt={featured.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                )}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"/>
                                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-8">
                                    <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                                        Featured recipe
                                    </span>
                                    <p className="max-w-xl text-2xl font-semibold leading-tight text-white sm:text-3xl">{featured.title}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                            <Fire size={12} weight="fill"/> {featured.calories.toLocaleString("en-US")} kcal
                                        </span>
                                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">P {featured.protein_g}g</span>
                                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">F {featured.fat_g}g</span>
                                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">C {featured.carbs_g}g</span>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    )}

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {gridRecipes.map(recipe => (
                            <Link key={recipe.id} href={`/my-profile/nutrition/recipes/${recipe.id}`}>
                                <Card className="group relative aspect-[3/4] w-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.2)]">
                                    {recipe.image_url && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={recipe.image_url}
                                            alt={recipe.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"/>
                                    <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                        <Fire size={10} weight="fill"/> {recipe.calories.toLocaleString("en-US")}
                                    </span>
                                    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3.5">
                                        <p className="text-sm font-semibold leading-snug text-white line-clamp-2">{recipe.title}</p>
                                        <div className="flex flex-wrap gap-1">
                                            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">P {recipe.protein_g}g</span>
                                            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">F {recipe.fat_g}g</span>
                                            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">C {recipe.carbs_g}g</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href={pageHref(currentPage - 1)}
                        aria-disabled={currentPage <= 1}
                        className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 ${currentPage <= 1 ? "pointer-events-none opacity-30" : "hover:bg-black hover:text-white"}`}
                    >
                        <CaretLeft size={14} weight="bold"/>
                    </Link>
                    <span className="text-sm text-ink-strong/50">Page {currentPage} of {totalPages}</span>
                    <Link
                        href={pageHref(currentPage + 1)}
                        aria-disabled={currentPage >= totalPages}
                        className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/[0.045] text-ink-strong transition-colors duration-200 ${currentPage >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-black hover:text-white"}`}
                    >
                        <CaretRight size={14} weight="bold"/>
                    </Link>
                </div>
            )}
        </div>
    )
}
