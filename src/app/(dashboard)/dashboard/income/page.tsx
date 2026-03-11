import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Plus, TrendingUp, Download, Filter } from "lucide-react";
import Link from "next/link";

const sampleEntries = [
  {
    id: "1",
    description: "Freelance Web Design",
    source: "Client Project",
    date: "Mar 8, 2026",
    amount: "₦150,000",
    category: "Freelance",
    status: "Confirmed",
  },
  {
    id: "2",
    description: "UI/UX Consultation",
    source: "TechCorp Ltd",
    date: "Mar 5, 2026",
    amount: "₦80,000",
    category: "Consulting",
    status: "Confirmed",
  },
  {
    id: "3",
    description: "Logo Design",
    source: "StartupXYZ",
    date: "Feb 28, 2026",
    amount: "₦45,000",
    category: "Design",
    status: "Pending",
  },
  {
    id: "4",
    description: "Monthly Retainer",
    source: "Agency Partner",
    date: "Feb 1, 2026",
    amount: "₦200,000",
    category: "Retainer",
    status: "Confirmed",
  },
];

const categoryColors: Record<string, string> = {
  Freelance: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Consulting: "bg-blue-50 text-blue-700 border-blue-200",
  Design: "bg-purple-50 text-purple-700 border-purple-200",
  Retainer: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function IncomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Income"
        subtitle="Track all your income sources"
      />

      <main className="flex-1 p-5 md:p-6 space-y-5 max-w-[1400px] w-full mx-auto">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Total Income (2026)
              </p>
              <p className="text-2xl font-extrabold text-slate-900">
                ₦475,000
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                4 entries
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">
                This Month
              </p>
              <p className="text-2xl font-extrabold text-slate-900">
                ₦230,000
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                2 entries in March
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">
                Estimated Tax
              </p>
              <p className="text-2xl font-extrabold text-slate-900">₦47,500</p>
              <p className="text-xs text-slate-400 font-medium mt-1">
                10% effective rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Income table */}
        <Card className="rounded-2xl border-slate-200/80 bg-white shadow-sm">
          <CardHeader className="pt-5 px-5 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900">
              Income Entries
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Filter className="h-3.5 w-3.5 mr-1.5" />
                Filter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
              <Button
                size="sm"
                className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Income
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4">
                      Description
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sampleEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 shrink-0">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                              {entry.description}
                            </p>
                            <p className="text-xs text-slate-400">
                              {entry.source}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4 hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${categoryColors[entry.category] ?? "bg-slate-50 text-slate-600 border-slate-200"}`}
                        >
                          {entry.category}
                        </Badge>
                      </td>
                      <td className="py-3.5 pr-4 hidden md:table-cell">
                        <span className="text-sm text-slate-500">
                          {entry.date}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            entry.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {entry.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 text-right">
                        <span className="text-sm font-bold text-slate-900">
                          {entry.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
