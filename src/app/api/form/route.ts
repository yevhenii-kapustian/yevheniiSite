import { NextRequest, NextResponse } from "next/server";
import { countRecentLeadSubmissions, insertLead } from "@/supabase/queries";

const RATE_LIMIT_MAX_SUBMISSIONS = 3
const RATE_LIMIT_WINDOW_MINUTES = 10

type LeadPayload = {
    goal: string
    gender: string
    age: string
    motivation: string
    instagramInstalled: string
    name: string
    email: string
    instagram: string
    website?: string
}

const getClientIp = (req: NextRequest): string => {
    const forwardedFor = req.headers.get("x-forwarded-for")
    if (forwardedFor) return forwardedFor.split(",")[0].trim()
    return req.headers.get("x-real-ip") || "unknown"
}

const sendTelegramNotification = async (body: LeadPayload) => {
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID
    if (!token || !chatId) return

    const text = `New lead \u{1F4AA}\n\n`
        + `Goal: ${body.goal}\n`
        + `Gender: ${body.gender}\n`
        + `Age: ${body.age}\n`
        + `Motivation: ${body.motivation}\n`
        + `Instagram installed: ${body.instagramInstalled}\n`
        + `Name: ${body.name}\n`
        + `Email: ${body.email}\n`
        + `Instagram: ${body.instagram}`

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ chat_id: chatId, text })
    })
}

export async function POST(req: NextRequest) {
    try {
        const body: LeadPayload = await req.json()

        // Honeypot: real users never see or fill this field, only bots do.
        // Pretend success so scripts don't learn they were caught.
        if (body.website) {
            return NextResponse.json({message: "Success"})
        }

        const ip = getClientIp(req)

        const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()
        const count = await countRecentLeadSubmissions(ip, windowStart)

        if (count >= RATE_LIMIT_MAX_SUBMISSIONS) {
            return NextResponse.json({message: "Too many requests"}, {status: 429})
        }

        await insertLead({
            goal: body.goal,
            gender: body.gender,
            age: body.age,
            motivation: body.motivation,
            instagram_installed: body.instagramInstalled,
            name: body.name,
            email: body.email,
            instagram: body.instagram,
            ip,
        })

        await sendTelegramNotification(body)

        return NextResponse.json({message: "Success"})
    } catch (error) {
        console.log(error);
        return NextResponse.json({message: "Server Error"}, {status: 500})
    }
}
