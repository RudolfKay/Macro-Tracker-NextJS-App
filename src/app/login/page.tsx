"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { useToast } from "@/components/ui/use-toast";
import { showApiErrorToast } from "@/lib/utils";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.error) {
        showApiErrorToast(toast, "Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      showApiErrorToast(toast, err, "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-4 pb-8 md:py-12 bg-background overflow-y-auto min-h-screen p-2 sm:p-4">
      <div className="w-full max-w-md space-y-4 mx-auto">
        <AuthCard title="Sign In" description="Enter your credentials to access your account">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
            <FormField
              label="Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                tabIndex={0}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </FormField>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          <div className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-emerald-500 hover:underline text-base sm:text-sm">
              Sign up
            </Link>
          </div>
        </AuthCard>
      </div>
    </div>
  );
} 