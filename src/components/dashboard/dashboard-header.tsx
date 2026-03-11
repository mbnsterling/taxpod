"use client";

import { SidebarTrigger } from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Bell, Search } from "lucide-react";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  userName?: string | null;
  taxYear?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  userName,
  taxYear = "2025/2026",
}: DashboardHeaderProps) {
  const firstName = userName?.split(" ")[0] ?? "there";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-200/80 bg-white/80 backdrop-blur-sm px-4">
      <SidebarTrigger className="-ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg" />
      <Separator orientation="vertical" className="h-4 bg-slate-200" />
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-3">
          {title ? (
            <div>
              <h1 className="text-sm font-semibold text-slate-900">{title}</h1>
              {subtitle && (
                <p className="text-xs text-slate-400">{subtitle}</p>
              )}
            </div>
          ) : (
            <div>
              <h1 className="text-sm font-semibold text-slate-900">
                Welcome back, {firstName}!
              </h1>
              <p className="text-xs text-slate-400">
                Tax overview for {taxYear}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="hidden sm:flex text-xs font-medium text-slate-600 border-slate-200 bg-slate-50"
          >
            Freelancer
          </Badge>
          <Badge className="hidden sm:flex text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
            Not Started
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
          </Button>
        </div>
      </div>
    </header>
  );
}
