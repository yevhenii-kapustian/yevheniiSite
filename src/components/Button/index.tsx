'use client'

import Link from "next/link"
import clsx from "clsx"
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react"
import Spinner from "../Spinner"

export type ButtonVariant = "solid" | "solid-light" | "outline-dark" | "outline-light"
export type ButtonSize = "sm" | "md"

const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

const variantStyles: Record<ButtonVariant, string> = {
    solid: "bg-black text-white border-2 border-black hover:bg-ink-strong hover:border-ink-strong",
    "solid-light": "bg-white text-ink-strong border-2 border-white hover:bg-transparent hover:text-white",
    "outline-dark": "bg-transparent text-ink-strong border-2 border-ink-strong hover:bg-ink-strong hover:text-white",
    "outline-light": "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black",
}

const sizeStyles: Record<ButtonSize, string> = {
    sm: "py-2.5 px-5 text-sm",
    md: "py-3 px-7 sm:py-3.5 sm:px-9 text-sm sm:text-base",
}

type BaseProps = {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    loading?: boolean
    className?: string
    children: ReactNode
}

type ButtonAsLink = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string
    scroll?: boolean
}

type ButtonAsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined
}

type ButtonProps = ButtonAsLink | ButtonAsButton

const Button = (props: ButtonProps) => {
    const { variant = "solid", size = "md", fullWidth, loading, className, children } = props
    const classes = clsx(baseStyles, variantStyles[variant], sizeStyles[size], fullWidth && "w-full", loading && "relative", className)

    const content = loading ? (
        <>
            <span className="invisible inline-flex items-center gap-2">{children}</span>
            <span className="absolute inset-0 flex items-center justify-center"><Spinner/></span>
        </>
    ) : children

    if (props.href) {
        const { href, scroll, target, onClick, rel } = props as ButtonAsLink
        return (
            <Link href={href} scroll={scroll} target={target} rel={rel} onClick={onClick} className={classes}>
                {content}
            </Link>
        )
    }

    const { type = "button", onClick, disabled } = props as ButtonAsButton
    return (
        <button type={type} onClick={onClick} disabled={disabled || loading} className={classes}>
            {content}
        </button>
    )
}

export default Button
