import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { FileText, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";

const filingSteps = [
  {
    step: "01",
    title: "Record Income",
    description: "Add all your income sources for the tax year",
    status: "incomplete",
    href: "/dashboard/income",
    actionLabel: "Add Income",
  },
  {
    step: "02",
    title: "Add Deductions",
    description: "Log allowable business expenses and reliefs",
    status: "locked",
    href: "/dashboard/expenses",
    actionLabel: "Add Expenses",
  },
  {
    step: "03",
    title: "Review & Calculate",
    description: "Review your tax computation before filing",
    status: "locked",
    href: "#",
    actionLabel: "Review",
  },
  {
    step: "04",
    title: "Submit Return",
    description: "Submit your return to FIRS and get your TCC",
    status: "locked",
    href: "#",
    actionLabel: "Submit",
  },
];

export default function FileReturnPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="File Return"
        subtitle="Annual Personal Income Tax Return 2025/2026"
      />

      <main className="flex-1 p-5 md:p-6 space-y-5 max-w-[1400px] w-full mx-auto">
        {/* Status banner */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                Filing Status
              </p>
              <h2 className="text-xl font-extrabold text-white">
                Not Started
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Annual PIT Return · Deadline: 30 Jun 2026
              </p>
            </div>
            <Badge className="text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full shrink-0">
              112 days left
            </Badge>
          </div>
        </div>

        {/* Filing steps */}
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-base font-semibold text-slate-900 mb-5">
              Filing Checklist
            </h3>
            <div className="space-y-4">
              {filingSteps.map((step, index) => (
                <div
                  key={step.step}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                    step.status === "complete"
                      ? "border-emerald-200 bg-emerald-50/50"
                      : step.status === "incomplete"
                        ? "border-slate-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
                        : "border-slate-100 bg-slate-50/50 opacity-60"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 shrink-0">
                    {step.status === "complete" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : step.status === "locked" ? (
                      <span className="text-sm font-bold text-slate-300">
                        {step.step}
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-slate-600">
                        {step.step}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold ${step.status === "locked" ? "text-slate-400" : "text-slate-900"}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                  {step.status !== "locked" && (
                    <Button
                      size="sm"
                      className="shrink-0 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold"
                      render={<Link href={step.href} />}
                    >
                      {step.actionLabel}
                      <ArrowRight className="h-3 w-3 ml-1.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
