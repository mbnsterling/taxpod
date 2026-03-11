"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

type ForgotValues = z.infer<typeof forgotSchema>;

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

function SecurityPreviewCard() {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
      <div className="space-y-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-3xl">
          🔐
        </div>

        <div className="space-y-3">
          {[
            {
              icon: "🛡️",
              title: "No account hints",
              desc: "We never confirm whether an email is registered.",
            },
            {
              icon: "⏱️",
              title: "Time-limited links",
              desc: "Reset links expire after a short window for safety.",
            },
            {
              icon: "🔒",
              title: "Protected tax history",
              desc: "Your filings stay encrypted and tied to your account.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 text-base">{item.icon}</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="text-xs text-emerald-100/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/30 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          <span className="text-xs font-medium text-white">
            End-to-end encrypted
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setFormError(
          data?.error ?? "Unable to start reset. Please try again in a moment.",
        );
        return;
      }

      setSuccessMessage(
        "If an account exists for this email, you'll receive a reset link shortly.",
      );
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
              Forgot Password?
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              No worries — we&apos;ll send you a secure reset link.
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
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                {...register("email")}
              />
              {errors.email?.message ? (
                <p className="text-[11px] text-red-600">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-900 active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  Send Reset Link{" "}
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
          <SecurityPreviewCard />

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              Your security matters
            </h2>
            <p className="text-sm text-emerald-100">
              Account recovery designed with privacy first
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-white/40" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
            <div className="h-2 w-6 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
