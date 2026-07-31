import type { Metadata } from "next"
import LoginContent from "./LoginContent"

export const metadata: Metadata = {
    title: "Log In - Yevhenii Fit",
}

export default function Login () {
    return <LoginContent/>
}
