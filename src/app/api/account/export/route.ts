import { NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { getUserDataExport } from "@/supabase/queries";

export async function GET() {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const data = await getUserDataExport(user.id)

    return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="yevhenii-fit-data-${user.id}.json"`,
        },
    })
}
