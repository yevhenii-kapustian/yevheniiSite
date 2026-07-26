'use client'

import { Component, type ReactNode } from "react"

type Props = {
    children: ReactNode
}

type State = {
    hasError: boolean
}

class BodyAvatarErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: unknown) {
        console.log("BodyAvatar failed to render:", error)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-ink-strong/60">
                    Couldn&apos;t load the 3D preview. Your stats and calorie plan below still work fine.
                </div>
            )
        }

        return this.props.children
    }
}

export default BodyAvatarErrorBoundary
