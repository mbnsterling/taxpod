import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Receipt, Plus, Construction } from "lucide-react";

export default function ExpensesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Expenses"
        subtitle="Log and track your business expenses"
      />

      <main className="flex-1 p-5 md:p-6 max-w-[1400px] w-full mx-auto">
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
          <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-md">
              <Receipt className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Expenses Tracking
                </h2>
                <Badge className="text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-50">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-sm text-slate-500 max-w-sm">
                Expense tracking is currently in development. You&apos;ll be
                able to log deductible business expenses and reduce your tax
                liability.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
                <Construction className="h-4 w-4 text-amber-500" />
                <span>Launching Q2 2026</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 text-slate-600 text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Get notified
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
