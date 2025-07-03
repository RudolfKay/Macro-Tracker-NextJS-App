"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { User, LogOut, LayoutDashboard, Shield, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

export const NavBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Mobile nav links for all users
  const mobileNavLinks = isLoggedIn ? (
    <nav className="flex flex-col gap-4">
      <Link href="/dashboard" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>
        Dashboard
      </Link>
      {isAdmin && (
        <Link href="/admin" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>
          Admin Panel
        </Link>
      )}
      <Link href="/profile" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>
        Profile
      </Link>
      <button
        className="text-base font-medium text-red-600 hover:text-red-700 px-2 py-2 text-left"
        onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
        aria-label="Sign Out"
      >
        Sign Out
      </button>
    </nav>
  ) : (
    <nav className="flex flex-col gap-2">
      <Link href="/#features" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>Features</Link>
      <Link href="/#how-it-works" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
      <Link href="/#testimonials" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</Link>
      <Link href="/#pricing" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
      <Link href="/login" className="text-base font-medium text-muted-foreground hover:text-foreground px-2 py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
      <Link href="/signup" className="text-base font-medium text-emerald-600 hover:text-emerald-700 px-2 py-2" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
    </nav>
  );

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-2 sm:px-4 md:px-6 relative">
          {/* Left: Logo and Hamburger */}
          <div className="flex items-center gap-4 md:w-auto">
            <Link href="/" className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              <span className="inline-block font-bold">MacroTrack</span>
            </Link>
            {/* Hamburger menu for mobile (always visible on mobile) */}
            <button
              className="ml-2 flex md:hidden items-center justify-center p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileMenuOpen((open) => !open)}
              tabIndex={0}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setMobileMenuOpen(open => !open); }}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          {/* Center: Nav links (desktop, non-logged-in only) */}
          {!isLoggedIn && (
            <nav className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
              <Link href="/#features" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</Link>
              <Link href="/#how-it-works" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</Link>
              <Link href="/#testimonials" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Testimonials</Link>
              <Link href="/#pricing" className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
            </nav>
          )}
          {/* Right: Mode toggle and actions */}
          <div className="flex items-center space-x-2 md:ml-auto">
            <ModeToggle />
            <div className="hidden md:flex items-center space-x-2">
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
            </div>
          </div>
        </div>
      </header>
      {/* Mobile menu dropdown (not a full-page drawer, no overlay) */}
      {mobileMenuOpen && (
        <div
          className="fixed left-0 right-0 top-16 z-50 mx-2 mt-0 bg-background shadow-lg border border-border rounded-lg overflow-y-auto md:hidden"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="px-4 py-2">
            {mobileNavLinks}
          </div>
        </div>
      )}
    </>
  );
}; 