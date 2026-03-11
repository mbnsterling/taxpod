"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { AppLogo } from "./app-logo";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white/80 py-6 backdrop-blur-sm transition-all duration-500">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <AppLogo />

        {/* Desktop nav links */}
        <div className="hidden items-center gap-10 md:flex">
          <nav className="flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-600"
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full ${
                      isActive ? "w-full" : ""
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-6 border-l border-slate-700/20 pl-8">
            {/* Theme toggle placeholder */}
            <button
              type="button"
              aria-label="Toggle theme"
              className="flex h-8 w-14 items-center rounded-full border border-slate-200 bg-slate-100 p-1 transition-colors duration-500"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 text-amber-500"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </div>
            </button>

            <Button
              render={<Link href="/login" />}
              className="rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:bg-emerald-900 active:scale-95"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-8 w-14 items-center rounded-full border border-slate-200 bg-slate-100 p-1 transition-colors duration-500"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-amber-500"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            </div>
          </button>

          <button
            type="button"
            aria-label="Open navigation menu"
            className="rounded-lg p-2 text-slate-900 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
              aria-hidden="true"
            >
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
