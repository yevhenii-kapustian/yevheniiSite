import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

// PKCE (the @supabase/ssr default) requires a code_verifier stored in the browser that
// *started* the auth request. Our magic links are generated server-side (admin.generateLink
// in the Stripe webhook) with no originating browser, so no verifier ever exists for them —
// clicking the email link anywhere reliably fails PKCE exchange ("code verifier not found",
// surfaced to the user as "That link expired"). Implicit flow puts the session tokens
// straight in the URL hash fragment instead, which needs no locally-stored verifier and
// works regardless of which browser/device opens the link.
let client: ReturnType<typeof createBrowserClient<Database>> | undefined

// Every caller must share this ONE client instance. Header, WelcomeContent, LoginContent,
// etc. all mount on the same page and each used to call createBrowserClient() themselves —
// two independent clients racing to consume the same one-time URL hash token (whichever
// wins strips it from the URL first) is what caused magic links to intermittently show as
// expired even with a valid, unconsumed token still sitting in the URL.
// detectSessionInUrl's automatic hash-token consumption was never reliably turning into a
// session middleware/server components could see (no cookie ever got written) — WelcomeContent
// now parses the hash and calls setSession() itself, so this is turned off to avoid it
// racing/double-consuming the same one-time tokens.
export const getBrowserClient = () => {
    if (!client) {
        client = createBrowserClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { auth: { flowType: "implicit", detectSessionInUrl: false } }
        )
    }
    return client
}
