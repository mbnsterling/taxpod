"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { AppLogo } from "./app-logo";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-slate-900 transition-colors hover:bg-slate-100"
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

      {/* Mobile Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-[300px] bg-white p-0">
          <SheetHeader className="border-b border-slate-100 px-6 py-5">
            <SheetTitle asChild>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-base font-black text-white shadow-lg shadow-emerald-500/20">
                  T
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-black tracking-tight text-slate-900">
                    TaxEase
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-emerald-500 uppercase">
                    Nigeria
                  </span>
                </div>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col px-4 py-4" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 px-6 py-5">
            <Button
              render={<Link href="/login" onClick={() => setMobileOpen(false)} />}
              className="w-full rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition-all hover:bg-emerald-900 active:scale-95"
            >
              Sign In
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
