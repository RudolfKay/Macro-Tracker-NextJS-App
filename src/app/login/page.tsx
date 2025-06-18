"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            <span className="font-bold text-xl">MacroTrack</span>
          </Link>
          <ModeToggle />
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-emerald-500 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 