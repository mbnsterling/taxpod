import { auth } from "~/server/auth";
import { DashboardHeader } from "~/components/dashboard/dashboard-header";
import { SettingsForm } from "~/components/dashboard/settings-form";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />

      <main className="flex-1 p-5 md:p-6 max-w-[860px] w-full mx-auto">
        <SettingsForm user={session?.user} />
      </main>
    </div>
  );
}
