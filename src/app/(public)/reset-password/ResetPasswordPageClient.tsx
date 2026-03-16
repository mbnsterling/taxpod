 "use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const resetSchema = z
  .object({
    password: z
      .string()
      .min(10, "Password must be at least 10 characters.")
      .regex(/[A-Z]/, "Add at least one uppercase letter.")
      .regex(/[a-z]/, "Add at least one lowercase letter.")
      .regex(/[0-9]/, "Add at least one number.")
      .regex(/[^A-Za-z0-9]/, "Add at least one special character."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof resetSchema>;

function TaxEaseLogo() {
  return (
    <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-lg font-black text-white shadow-lg shadow-emerald-500/20">
        T
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-slate-900">
          TaxEase
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase">
          Nigeria
        </span>
      </div>
    </Link>
  );
}

function PasswordTipsCard() {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
      <div className="space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
          🔑
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-white">
            Creating a strong password
          </p>
          {[
            "Mix uppercase, lowercase, numbers, and symbols",
            "Use at least 10 characters",
            "Avoid using personal information",
            "Don't reuse passwords across services",
          ].map((tip) => (
            <div key={tip} className="flex items-start gap-2 text-xs text-emerald-100">
              <span className="mt-0.5 text-emerald-300">✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-white/10 p-3">
          <p className="text-xs text-emerald-100">
            Your password is stored as a secure hash — even TaxEase cannot read
            it.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password") ?? "";
  const checks = [
    { label: "At least 10 characters", passed: password.length >= 10 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "One lowercase letter", passed: /[a-z]/.test(password) },
    { label: "One number", passed: /[0-9]/.test(password) },
    { label: "One special character", passed: /[^A-Za-z0-9]/.test(password) },
  ];

  useEffect(() => {
    if (!token) {
      setFormError("Reset link is missing or invalid.");
    }
  }, [token]);

  const onSubmit = handleSubmit(async (values) => {
    if (!token) {
      setFormError("Reset link is missing or invalid.");
      return;
    }

    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setFormError(
          data?.error ?? "Unable to reset password. The link may have expired.",
        );
        return;
      }

      setSuccessMessage(
        "Password updated. Redirecting you to sign in...",
      );
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
      setFormError("Something went wrong. Please try again.");
    }
  });

  return (
    <div className="flex min-h-screen">
      {/* Left: Form Panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <TaxEaseLogo />

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              Choose a New Password
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Your new password will replace the old one for this account.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {formError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {formError}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                {successMessage}
              </div>
            ) : null}

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                {...register("password")}
              />
              {errors.password?.message ? (
                <p className="text-[11px] text-red-600">
                  {errors.password.message}
                </p>
              ) : null}

              {password.length > 0 && (
                <div className="mt-1.5 grid grid-cols-2 gap-1">
                  {checks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center gap-1 text-[11px] ${check.passed ? "text-emerald-700" : "text-slate-400"}`}
                    >
                      <span>{check.passed ? "✓" : "·"}</span>
                      <span>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword?.message ? (
                <p className="text-[11px] text-red-600">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-900 active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                "Updating..."
              ) : (
                <>
                  Update Password{" "}
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right: Visual Panel */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18)_0,_transparent_50%)]" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-emerald-300/15 blur-2xl" />

        <div className="relative flex flex-col items-center gap-8 px-12 text-center">
          <PasswordTipsCard />

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              Secure by design
            </h2>
            <p className="text-sm text-emerald-100">
              Your tax data stays private and protected
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/40" />
            <div className="h-2 w-6 rounded-full bg-white" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

