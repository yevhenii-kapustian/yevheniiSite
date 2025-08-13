import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const response = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body)
        }) 

        const result = await response.text()

        return NextResponse.json({message: "Success", googleResponse: result})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Server Error"}, {status: 500})
    }
}