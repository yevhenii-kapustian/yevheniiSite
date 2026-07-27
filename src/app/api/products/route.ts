import { NextResponse } from "next/server";
import { getActiveProducts } from "@/supabase/queries";

export async function GET() {
    try {
        const data = await getActiveProducts()

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
