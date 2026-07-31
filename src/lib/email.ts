import { getResend } from "@/lib/resend"

export const sendMagicLinkEmail = async (email: string, actionLink: string) => {
    const from = process.env.RESEND_FROM_EMAIL
    if (!from) return

    const resend = getResend()
    await resend.emails.send({
        from,
        to: email,
        replyTo: "yevheni.fit@gmail.com",
        subject: "You're in — sign in to see your plan",
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
                <h1 style="font-size: 20px;">You're in!</h1>
                <p style="font-size: 14px; line-height: 1.6; color: #444;">
                    Tap below to sign in and see your personalized plan.
                </p>
                <p style="margin: 24px 0;">
                    <a href="${actionLink}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 600; font-size: 14px;">
                        Sign in
                    </a>
                </p>
            </div>
        `,
    })
}
