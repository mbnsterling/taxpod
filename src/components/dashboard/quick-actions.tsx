"use client";

import { motion } from "framer-motion";
import { Plus, Receipt, FileText, Eye } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  staggerContainerVariants,
  scaleInItemVariants,
  cardHoverWhileHover,
  cardHoverTransition,
} from "~/lib/motion";

const actions = [
  {
    title: "Add Income",
    description: "Record a new income entry",
    icon: Plus,
    href: "/dashboard/income",
    iconBg: "bg-emerald-800",
    iconColor: "text-white",
    available: true,
  },
  {
    title: "Add Expense",
    description: "Log a business expense",
    icon: Receipt,
    href: "/dashboard/expenses",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    available: false,
    badge: "Soon",
  },
  {
    title: "Start Filing",
    description: "Begin your tax return",
    icon: FileText,
    href: "/dashboard/file-return",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-400",
    available: false,
    badge: "Soon",
  },
  {
    title: "View Tax Estimate",
    description: "See your estimated liability",
    icon: Eye,
    href: "/dashboard",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    available: true,
    secondary: true,
  },
];

export function QuickActions() {
  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">
        Quick Actions
      </h2>
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {actions.map((action) => (
          <motion.div
            key={action.title}
            variants={scaleInItemVariants}
            whileHover={action.available ? cardHoverWhileHover : undefined}
            transition={cardHoverTransition}
          >
            <Link
              href={action.available ? action.href : "#"}
              className={!action.available ? "cursor-not-allowed" : ""}
            >
              <Card
                className={`border rounded-2xl transition-all ${
                  action.available && !action.secondary
                    ? "border-emerald-700 bg-emerald-800 hover:bg-emerald-900 shadow-md cursor-pointer"
                    : action.available
                      ? "border-slate-200 bg-white hover:shadow-md cursor-pointer"
                      : "border-slate-100 bg-slate-50/60 opacity-60 cursor-not-allowed"
                }`}
              >
                <CardContent className="p-4 flex flex-col items-center text-center gap-2.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      action.available && !action.secondary
                        ? "bg-white/20"
                        : action.iconBg
                    }`}
                  >
                    <action.icon
                      className={`h-5 w-5 ${
                        action.available && !action.secondary
                          ? "text-white"
                          : action.iconColor
                      }`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold leading-tight ${
                        action.available && !action.secondary
                          ? "text-white"
                          : "text-slate-700"
                      }`}
                    >
                      {action.title}
                    </p>
                    {action.badge && (
                      <Badge className="mt-1 text-[10px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-50">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
