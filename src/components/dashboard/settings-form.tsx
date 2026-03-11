"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Save, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import { Badge } from "~/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

// --- Schemas ---
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional(),
  tin: z.string().optional(),
  occupation: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Minimum 8 characters"),
    newPassword: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string().min(8, "Minimum 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

interface SettingsFormProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

function ProfileTab({ user }: SettingsFormProps) {
  const [saved, setSaved] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: "",
      tin: "",
      occupation: "Freelancer",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Avatar */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-2xl">
              <AvatarImage src={user?.image ?? ""} />
              <AvatarFallback className="rounded-2xl bg-emerald-100 text-emerald-800 font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 text-xs rounded-xl border-slate-200 text-slate-600"
              >
                Change photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card className="rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="pt-5 px-5 pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">
            Personal Information
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Update your personal and tax profile details
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Full Name
              </Label>
              <Input
                {...form.register("name")}
                placeholder="Adaobi Okonkwo"
                className="rounded-xl border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              <FieldError message={form.formState.errors.name?.message} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Email Address
              </Label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="adaobi@example.com"
                className="rounded-xl border-slate-200 text-sm focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              <FieldError message={form.formState.errors.email?.message} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Phone Number
              </Label>
              <Input
                {...form.register("phone")}
                placeholder="+234 800 000 0000"
                className="rounded-xl border-slate-200 text-sm focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Occupation
              </Label>
              <Input
                {...form.register("occupation")}
                placeholder="Freelancer"
                className="rounded-xl border-slate-200 text-sm focus:border-emerald-500"
              />
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Tax Identification Number (TIN)
            </Label>
            <div className="flex gap-2">
              <Input
                {...form.register("tin")}
                placeholder="12345678-0001"
                className="rounded-xl border-slate-200 text-sm focus:border-emerald-500 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 text-xs text-slate-600 shrink-0"
              >
                Verify
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              Your TIN from FIRS. Required for filing your return.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold px-6"
        >
          {saved ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Saved!
            </>
          ) : form.formState.isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

const notificationSettings = [
  {
    id: "deadline_reminders",
    title: "Deadline Reminders",
    description: "Get notified when tax deadlines are approaching",
    defaultEnabled: true,
  },
  {
    id: "filing_updates",
    title: "Filing Status Updates",
    description: "Receive updates when your return status changes",
    defaultEnabled: true,
  },
  {
    id: "new_features",
    title: "New Features",
    description: "Be the first to know about new TaxPod features",
    defaultEnabled: false,
  },
  {
    id: "monthly_summary",
    title: "Monthly Income Summary",
    description: "Monthly email with your income and tax overview",
    defaultEnabled: true,
  },
  {
    id: "marketing",
    title: "Marketing & Promotions",
    description: "Special offers and promotional communications",
    defaultEnabled: false,
  },
];

function NotificationsTab() {
  const [settings, setSettings] = useState(
    Object.fromEntries(
      notificationSettings.map((s) => [s.id, s.defaultEnabled]),
    ),
  );

  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm">
      <CardHeader className="pt-5 px-5 pb-4">
        <CardTitle className="text-base font-semibold text-slate-900">
          Notification Preferences
        </CardTitle>
        <CardDescription className="text-xs text-slate-400">
          Choose what notifications you&apos;d like to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5 space-y-1">
        {notificationSettings.map((setting, index) => (
          <div key={setting.id}>
            <div className="flex items-center justify-between py-3.5">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-semibold text-slate-900">
                  {setting.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {setting.description}
                </p>
              </div>
              <Switch
                checked={settings[setting.id]}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, [setting.id]: checked }))
                }
                className="data-[state=checked]:bg-emerald-700 shrink-0"
              />
            </div>
            {index < notificationSettings.length - 1 && (
              <Separator className="bg-slate-50" />
            )}
          </div>
        ))}
        <div className="pt-3">
          <Button className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold px-6">
            <Save className="h-4 w-4 mr-2" />
            Save preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saved, setSaved] = useState(false);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 800));
    setSaved(true);
    form.reset();
    setTimeout(() => setSaved(false), 3000);
  });

  return (
    <div className="space-y-5">
      <Card className="rounded-2xl border-slate-200/80 shadow-sm">
        <CardHeader className="pt-5 px-5 pb-4">
          <CardTitle className="text-base font-semibold text-slate-900">
            Change Password
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            Ensure your account is using a strong, unique password
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  {...form.register("currentPassword")}
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  className="rounded-xl border-slate-200 text-sm pr-10 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FieldError
                message={form.formState.errors.currentPassword?.message}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    {...form.register("newPassword")}
                    type={showNew ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="rounded-xl border-slate-200 text-sm pr-10 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <FieldError
                  message={form.formState.errors.newPassword?.message}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Confirm New Password
                </Label>
                <Input
                  {...form.register("confirmPassword")}
                  type="password"
                  placeholder="Repeat new password"
                  className="rounded-xl border-slate-200 text-sm focus:border-emerald-500"
                />
                <FieldError
                  message={form.formState.errors.confirmPassword?.message}
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-sm font-semibold px-6"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Updated!
                  </>
                ) : form.formState.isSubmitting ? (
                  "Updating..."
                ) : (
                  "Update password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="rounded-2xl border-red-200/60 bg-red-50/30 shadow-sm">
        <CardHeader className="pt-5 px-5 pb-4">
          <CardTitle className="text-base font-semibold text-red-700">
            Danger Zone
          </CardTitle>
          <CardDescription className="text-xs text-red-500">
            These actions are irreversible. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Delete Account
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 rounded-xl text-xs font-semibold"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SettingsForm({ user }: SettingsFormProps) {
  return (
    <Tabs defaultValue="profile" className="space-y-5">
      <TabsList className="bg-slate-100 rounded-xl p-1 h-auto">
        <TabsTrigger
          value="profile"
          className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm px-4 py-2"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger
          value="notifications"
          className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm px-4 py-2"
        >
          Notifications
        </TabsTrigger>
        <TabsTrigger
          value="security"
          className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:font-semibold data-[state=active]:shadow-sm px-4 py-2"
        >
          Security
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-0">
        <ProfileTab user={user} />
      </TabsContent>

      <TabsContent value="notifications" className="mt-0">
        <NotificationsTab />
      </TabsContent>

      <TabsContent value="security" className="mt-0">
        <SecurityTab />
      </TabsContent>
    </Tabs>
  );
}
