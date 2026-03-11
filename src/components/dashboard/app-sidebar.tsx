"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  FileText,
  Settings,
  LogOut,
  ChevronUp,
  Bell,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "~/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Income",
    href: "/dashboard/income",
    icon: TrendingUp,
  },
  {
    title: "Expenses",
    href: "/dashboard/expenses",
    icon: Receipt,
    badge: "Soon",
  },
  {
    title: "File Return",
    href: "/dashboard/file-return",
    icon: FileText,
    badge: "Soon",
  },
];

const moreNavItems = [
  {
    title: "Help Center",
    href: "/dashboard/help",
    icon: HelpCircle,
  },
  {
    title: "Documentation",
    href: "/dashboard/docs",
    icon: BookOpen,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
];

interface AppSidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Sidebar className="border-r border-slate-200/80 bg-white">
      {/* Header */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 shadow-sm group-hover:bg-emerald-900 transition-colors">
            <span className="text-white font-black text-sm">T</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
              TaxPod
            </span>
            <span className="text-xs text-slate-400 font-medium">Nigeria</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-slate-100" />

      {/* Main Navigation */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item.href, item.exact)}
                    className={cn(
                      "rounded-xl h-10 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all",
                      isActive(item.href, item.exact) &&
                        "bg-emerald-50 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-800 font-semibold",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4",
                        isActive(item.href, item.exact)
                          ? "text-emerald-700"
                          : "text-slate-400",
                      )}
                    />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* More Section */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
            More
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {moreNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.href} />}
                    isActive={isActive(item.href)}
                    className={cn(
                      "rounded-xl h-10 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all",
                      isActive(item.href) &&
                        "bg-emerald-50 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-800 font-semibold",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4",
                        isActive(item.href)
                          ? "text-emerald-700"
                          : "text-slate-400",
                      )}
                    />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings link */}
        <SidebarGroup className="mt-4">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/dashboard/settings" />}
                  isActive={isActive("/dashboard/settings")}
                  className={cn(
                    "rounded-xl h-10 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all",
                    isActive("/dashboard/settings") &&
                      "bg-emerald-50 text-emerald-800 hover:bg-emerald-50 hover:text-emerald-800 font-semibold",
                  )}
                >
                  <Settings
                    className={cn(
                      "h-4 w-4",
                      isActive("/dashboard/settings")
                        ? "text-emerald-700"
                        : "text-slate-400",
                    )}
                  />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — User block */}
      <SidebarSeparator className="bg-slate-100" />
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <SidebarMenuButton className="rounded-xl h-auto py-2.5 px-3 hover:bg-slate-50 data-[state=open]:bg-slate-50 transition-all w-full">
                  <Avatar className="h-8 w-8 rounded-lg shrink-0">
                    <AvatarImage
                      src={user?.image ?? ""}
                      alt={user?.name ?? ""}
                    />
                    <AvatarFallback className="rounded-lg bg-emerald-100 text-emerald-800 font-bold text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <span className="text-sm font-semibold text-slate-900 truncate">
                      {user?.name ?? "User"}
                    </span>
                    <span className="text-xs text-slate-400 truncate">
                      {user?.email ?? ""}
                    </span>
                  </div>
                  <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-56 rounded-xl border border-slate-200 shadow-lg"
                align="start"
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user?.name ?? "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user?.email ?? ""}
                  </p>
                </div>
                <DropdownMenuItem
                  className="rounded-lg mt-1 cursor-pointer"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer"
                  onClick={() => router.push("/dashboard/notifications")}
                >
                  <Bell className="h-4 w-4 text-slate-400" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="rounded-lg mb-1 text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
