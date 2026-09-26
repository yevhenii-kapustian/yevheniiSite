'use client'

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { MagnifyingGlass, SlidersHorizontal, X } from "@phosphor-icons/react"
import Dropdown from "../../Dropdown"

const SORT_OPTIONS = [
    { value: "title", label: "Name (A–Z)" },
    { value: "calories_asc", label: "Calories (low to high)" },
    { value: "calories_desc", label: "Calories (high to low)" },
    { value: "protein_desc", label: "Protein (high to low)" },
    { value: "newest", label: "Newest added" },
]

type RecipeFiltersProps = {
    search: string
    minProtein: string
    maxCalories: string
    sort: string
}

const RecipeFilters = ({ search: initialSearch, minProtein: initialMinProtein, maxCalories: initialMaxCalories, sort }: RecipeFiltersProps) => {
    const router = useRouter()
    const pathname = usePathname()

    const [search, setSearch] = useState(initialSearch)
    const [minProtein, setMinProtein] = useState(initialMinProtein)
    const [maxCalories, setMaxCalories] = useState(initialMaxCalories)

    const updateParams = (patch: Record<string, string>) => {
        const next = { search, minProtein, maxCalories, sort, ...patch }
        const params = new URLSearchParams()
        for (const [key, value] of Object.entries(next)) {
            if (value) params.set(key, value)
        }
        router.push(`${pathname}?${params.toString()}`)
    }

    const applyFilters = () => updateParams({ search, minProtein, maxCalories })

    const hasActiveFilters = Boolean(search || minProtein || maxCalories)

    const clearFilters = () => {
        setSearch("")
        setMinProtein("")
        setMaxCalories("")
        updateParams({ search: "", minProtein: "", maxCalories: "" })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-ink-strong/40">
                    <SlidersHorizontal size={14} weight="bold"/>
                    <span className="text-xs font-semibold uppercase tracking-[0.14em]">Filter &amp; sort</span>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs font-medium text-ink-strong/40 transition-colors duration-200 hover:text-ink-strong"
                    >
                        <X size={12} weight="bold"/> Clear filters
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex min-w-[180px] flex-1 flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Search</label>
                <div className="relative">
                    <MagnifyingGlass size={14} weight="bold" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-strong/30"/>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && applyFilters()}
                        onBlur={applyFilters}
                        placeholder="Recipe name…"
                        className="w-full rounded-2xl bg-black/[0.03] py-2.5 pl-9 pr-3.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Min protein (g)</label>
                <input
                    type="number"
                    min={0}
                    value={minProtein}
                    onChange={e => setMinProtein(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && applyFilters()}
                    onBlur={applyFilters}
                    placeholder="Any"
                    className="w-24 rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Max calories</label>
                <input
                    type="number"
                    min={0}
                    value={maxCalories}
                    onChange={e => setMaxCalories(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && applyFilters()}
                    onBlur={applyFilters}
                    placeholder="Any"
                    className="w-24 rounded-2xl bg-black/[0.03] px-3.5 py-2.5 text-sm text-ink-strong outline-none transition-colors duration-200 focus:bg-black/[0.05]"
                />
            </div>

            <div className="flex min-w-[180px] flex-col gap-1.5">
                <label className="text-xs font-medium uppercase tracking-[0.1em] text-ink-strong/35">Sort by</label>
                <Dropdown value={sort} onChange={value => updateParams({ sort: String(value) })} options={SORT_OPTIONS}/>
            </div>
            </div>
        </div>
    )
}

export default RecipeFilters
