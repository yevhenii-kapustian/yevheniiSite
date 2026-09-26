import { NextRequest, NextResponse } from "next/server";
import { getServerAuthClient } from "@/supabase/server-client";
import { insertProgressPhoto, deleteProgressPhoto } from "@/supabase/queries";
import { parseJsonBody } from "@/lib/parseJsonBody";

const VALID_LABELS = ["before", "after", "progress"]
const MAX_FILE_BYTES = 8 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

export async function POST(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    let formData: FormData
    try {
        formData = await req.formData()
    } catch {
        return NextResponse.json({ message: "Invalid request body" }, { status: 400 })
    }
    const file = formData.get("file")
    const label = formData.get("label")

    if (!(file instanceof File) || typeof label !== "string" || !VALID_LABELS.includes(label)) {
        return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type) || file.size > MAX_FILE_BYTES) {
        return NextResponse.json({ message: "Invalid image (jpeg/png/webp, max 8MB)" }, { status: 400 })
    }

    const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"
    const storagePath = `${user.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
        .from("progress-photos")
        .upload(storagePath, file, { contentType: file.type })

    if (uploadError) {
        return NextResponse.json({ message: "Upload failed" }, { status: 500 })
    }

    await insertProgressPhoto({ user_id: user.id, storage_path: storagePath, label })

    return NextResponse.json({ message: "Success" })
}

export async function DELETE(req: NextRequest) {
    const supabase = await getServerAuthClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await parseJsonBody<{ id?: unknown }>(req)
    if (error) return error

    const idNum = Number(data.id)
    if (!Number.isInteger(idNum) || idNum <= 0) {
        return NextResponse.json({ message: "Invalid id" }, { status: 400 })
    }

    await deleteProgressPhoto(user.id, idNum)

    return NextResponse.json({ message: "Success" })
}
