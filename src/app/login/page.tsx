"use client";

import Link from "next/link";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="py-8 md:py-12 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
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