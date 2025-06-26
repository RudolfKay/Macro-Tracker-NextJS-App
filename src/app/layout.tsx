import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import AuthProvider from "@/components/providers/session-provider"
import QueryProvider from '@/components/providers/query-client-provider'
import { NavBar } from "@/components/ui/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MacroTrack - Smart Nutrition Tracking",
  description: "Track your macros, achieve your fitness goals with our smart nutrition tracking app.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
              <NavBar />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
