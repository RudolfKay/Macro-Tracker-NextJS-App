"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { User, LogOut, LayoutDashboard, Shield, BarChart3 } from "lucide-react";

export const NavBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
            <span className="inline-block font-bold">MacroTrack</span>
          </Link>
          {!isLoggedIn && (
            <nav className="hidden gap-6 md:flex">
              <Link href="/#features" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
              <Link href="/#how-it-works" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</Link>
              <Link href="/#testimonials" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</Link>
              <Link href="/#pricing" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {!isLoggedIn ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm">
                  <Link href="/dashboard" className="flex items-center gap-1">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                </Button>
                {isAdmin && (
                  <Button asChild variant={pathname === "/admin" ? "default" : "ghost"} size="sm">
                    <Link href="/admin" className="flex items-center gap-1">
                      <Shield className="w-4 h-4" /> Admin Panel
                    </Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <User className="h-4 w-4 mr-2" />
                      {session.user.name || "User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="h-4 w-4 mr-2" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}; 