import { getServerClient } from "./server-client"
import type { Database } from "./database.types"

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"]
type PurchaseInsert = Database["public"]["Tables"]["purchases"]["Insert"]

export const getActiveProducts = async () => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, image, description, price")
        .order("sort_order", { ascending: true })

    if (error) throw error
    return data
}

export const getAllProductBasics = async () => {
    const supabase = getServerClient()
    const { data } = await supabase.from("products").select("name, description, image")
    return data
}

export const getProductForCheckout = async (id: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, price")
        .eq("id", Number(id))
        .single()

    return error ? null : data
}

export const getProductForFulfillment = async (id: string) => {
    const supabase = getServerClient()
    const { data, error } = await supabase
        .from("products")
        .select("id, name, download_url")
        .eq("id", Number(id))
        .single()

    return error ? null : data
}

export const countRecentLeadSubmissions = async (ip: string, windowStart: string) => {
    const supabase = getServerClient()
    const { count, error } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("ip", ip)
        .gte("created_at", windowStart)

    if (error) throw error
    return count ?? 0
}

export const insertLead = async (lead: LeadInsert) => {
    const supabase = getServerClient()
    const { error } = await supabase.from("leads").insert(lead)
    if (error) throw error
}

export const getPurchaseBySessionId = async (sessionId: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("purchases")
        .select("id")
        .eq("session_id", sessionId)
        .maybeSingle()

    return data
}

export const upsertPurchase = async (purchase: PurchaseInsert, ignoreDuplicates = false) => {
    const supabase = getServerClient()
    await supabase
        .from("purchases")
        .upsert(purchase, { onConflict: "session_id", ignoreDuplicates })
}

export const claimPurchaseDownload = async (sessionId: string) => {
    const supabase = getServerClient()
    const { data } = await supabase
        .from("purchases")
        .update({ revealed_at: new Date().toISOString() })
        .eq("session_id", sessionId)
        .is("revealed_at", null)
        .select()
        .maybeSingle()

    return data
}
