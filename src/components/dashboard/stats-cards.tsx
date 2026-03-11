"use client";

import { motion } from "framer-motion";
import { TrendingUp, Receipt, Calculator, Calendar } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import {
  staggerContainerVariants,
  scaleInItemVariants,
  cardHoverWhileHover,
  cardHoverTransition,
} from "~/lib/motion";

const stats = [
  {
    label: "Total Income",
    value: "₦0",
    sub: "0 entries",
    icon: TrendingUp,
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconColor: "text-white",
    trend: null,
  },
  {
    label: "Total Expenses",
    value: "₦0",
    sub: "Coming soon",
    icon: Receipt,
    iconBg: "bg-gradient-to-br from-orange-400 to-amber-500",
    iconColor: "text-white",
    trend: null,
  },
  {
    label: "Estimated Tax",
    value: "₦0",
    sub: "0.0% effective rate",
    icon: Calculator,
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-500",
    iconColor: "text-white",
    trend: null,
  },
  {
    label: "Filing Deadline",
    value: "30 Jun 2026",
    sub: "112 days remaining",
    icon: Calendar,
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
    iconColor: "text-white",
    subColor: "text-emerald-600 font-semibold",
    trend: null,
  },
];

export function StatsCards() {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={scaleInItemVariants}
          whileHover={cardHoverWhileHover}
          transition={cardHoverTransition}
        >
          <Card className="border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg} shadow-sm`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-extrabold text-slate-900 leading-tight">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs mt-1 ${stat.subColor ?? "text-slate-400"}`}
                    >
                      {stat.sub}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
