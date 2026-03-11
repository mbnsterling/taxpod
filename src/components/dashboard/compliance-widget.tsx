"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { fadeUpVariants } from "~/lib/motion";

const complianceSteps = [
  { label: "Has TIN", done: true },
  { label: "Income recorded", done: false },
  { label: "Expenses recorded", done: false },
  { label: "Return filed", done: false },
];

const deadlines = [
  {
    title: "Annual PIT Return",
    date: "30 Jun 2026",
    daysLeft: 112,
    urgent: false,
  },
  {
    title: "Monthly VAT Return",
    date: "31 Mar 2026",
    daysLeft: 21,
    urgent: true,
  },
];

function ComplianceDonut({ score }: { score: number }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative flex items-center justify-center">
        <svg width="100" height="100" className="-rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#1a6640"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-extrabold text-slate-900">{score}%</span>
          <span className="text-[10px] text-slate-400 font-medium -mt-0.5">
            Compliance
          </span>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-1">
        {complianceSteps.filter((s) => s.done).length} of {complianceSteps.length} steps complete
      </p>
    </div>
  );
}

export function ComplianceWidget() {
  const score = Math.round(
    (complianceSteps.filter((s) => s.done).length / complianceSteps.length) *
      100,
  );

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      custom={0.25}
    >
      <Card className="border border-slate-200/80 bg-white shadow-sm rounded-2xl">
        <CardHeader className="pt-5 px-5 pb-2">
          <CardTitle className="text-base font-semibold text-slate-900">
            Compliance Score
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-4">
          <ComplianceDonut score={score} />

          <div className="space-y-2">
            {complianceSteps.map((step) => (
              <div key={step.label} className="flex items-center gap-2.5">
                {step.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-300 shrink-0" />
                )}
                <span
                  className={`text-sm ${step.done ? "text-slate-700 font-medium" : "text-slate-400"}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <Separator className="bg-slate-100" />

          <div>
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Upcoming Deadlines
            </p>
            <div className="space-y-2.5">
              {deadlines.map((deadline) => (
                <div
                  key={deadline.title}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {deadline.title}
                    </p>
                    <p className="text-xs text-slate-400">{deadline.date}</p>
                  </div>
                  <Badge
                    className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                      deadline.urgent
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {deadline.daysLeft}d left
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
