"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import React from "react"

interface SignupRedirectButtonProps {
  children: React.ReactNode
  defaultHref?: string
  variant?: "outline" | "ghost" | "link" | undefined
  icon?: React.ReactNode
  size?: "sm" | "lg" | "default"
  className?: string
  ariaLabel?: string
}

export const SignupRedirectButton: React.FC<SignupRedirectButtonProps> = ({
  children,
  defaultHref = "/signup",
  variant,
  icon,
  size = "lg",
  className = "",
  ariaLabel,
}) => {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user
  const href = isAuthenticated ? "/dashboard" : defaultHref
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={className}
      aria-label={ariaLabel || (isAuthenticated ? "Go to Dashboard" : "Sign up")}
    >
      <Link href={href} tabIndex={0}>
        {children}
        {icon ? <span className="ml-2">{icon}</span> : null}
      </Link>
    </Button>
  )
} 