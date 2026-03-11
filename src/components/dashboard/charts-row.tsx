"use client";

import { motion } from "framer-motion";
import { PieChart, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { fadeUpVariants } from "~/lib/motion";

function EmptyChartPlaceholder({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-44 gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
        <Icon className="h-5 w-5 text-slate-300" />
      </div>
      <p className="text-sm text-slate-400 font-medium">{message}</p>
    </div>
  );
}

export function ChartsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        <Card className="border border-slate-200/80 bg-white shadow-sm rounded-2xl h-full">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-slate-900">
              Income by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <EmptyChartPlaceholder
              icon={PieChart}
              message="No income data to display"
            />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0.15}
      >
        <Card className="border border-slate-200/80 bg-white shadow-sm rounded-2xl h-full">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-base font-semibold text-slate-900">
              Monthly Income Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <EmptyChartPlaceholder
              icon={BarChart3}
              message="No monthly data to display"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
