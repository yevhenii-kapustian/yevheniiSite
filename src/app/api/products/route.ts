import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getSupabase = () => createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
    try {
        const supabase = getSupabase()
        const { data, error } = await supabase
            .from("products")
            .select("id, name, image, description, price")
            .order("sort_order", { ascending: true })

        if (error) throw error

        const products = data.map(item => ({
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            price: item.price,
        }))

        return NextResponse.json({ products })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Server Error" }, { status: 500 })
    }
}
