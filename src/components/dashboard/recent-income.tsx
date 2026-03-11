"use client";

import { motion } from "framer-motion";
import { CreditCard, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { fadeUpVariants } from "~/lib/motion";

const sampleIncomeData = [
  {
    id: "1",
    description: "Freelance Web Design",
    source: "Client Project",
    date: "Mar 8, 2026",
    amount: "₦150,000",
    category: "Freelance",
  },
  {
    id: "2",
    description: "UI/UX Consultation",
    source: "TechCorp Ltd",
    date: "Mar 5, 2026",
    amount: "₦80,000",
    category: "Consulting",
  },
  {
    id: "3",
    description: "Logo Design",
    source: "StartupXYZ",
    date: "Feb 28, 2026",
    amount: "₦45,000",
    category: "Design",
  },
];

const categoryColors: Record<string, string> = {
  Freelance: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Consulting: "bg-blue-50 text-blue-700 border-blue-200",
  Design: "bg-purple-50 text-purple-700 border-purple-200",
  Salary: "bg-orange-50 text-orange-700 border-orange-200",
};

interface RecentIncomeProps {
  hasData?: boolean;
}

export function RecentIncome({ hasData = false }: RecentIncomeProps) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      custom={0.2}
      className="flex-1"
    >
      <Card className="border border-slate-200/80 bg-white shadow-sm rounded-2xl h-full">
        <CardHeader className="pt-5 px-5 pb-4 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">
            Recent Income
          </CardTitle>
          {hasData && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg -mr-1"
              render={<Link href="/dashboard/income" />}
            >
              View all
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {hasData ? (
            <div className="space-y-3">
              {sampleIncomeData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 shrink-0">
                      <CreditCard className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {item.description}
                      </p>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold hidden sm:flex ${categoryColors[item.category] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
                    >
                      {item.category}
                    </Badge>
                    <span className="text-sm font-bold text-slate-900">
                      {item.amount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <CreditCard className="h-6 w-6 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">
                  No income recorded yet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Start by adding your first income entry.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold px-4"
                  render={<Link href="/dashboard/income" />}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Your First Income
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-slate-500 hover:text-slate-700 rounded-xl"
                >
                  Load Sample Data
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
