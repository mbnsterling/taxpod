"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Enter a valid email address."),
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

type RegisterValues = z.infer<typeof registerSchema>;

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

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Set up in under 2 minutes with just your name and email.",
  },
  {
    number: "02",
    title: "Connect your business",
    description: "Add your TIN, business details, and tax obligations.",
  },
  {
    number: "03",
    title: "File with confidence",
    description: "PIT, PAYE, and VAT flows built for Nigerian rules.",
  },
];

function OnboardingPreviewCard() {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
            ✓
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-white">
              Account created successfully
            </p>
            <p className="text-xs text-emerald-100">Verify email to activate</p>
          </div>
        </div>

        {steps.map((step, i) => (
          <div key={step.number} className="flex items-start gap-3">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i === 0
                  ? "bg-white text-emerald-800"
                  : "bg-white/20 text-white/70"
              }`}
            >
              {i === 0 ? "✓" : step.number}
            </div>
            <div className="text-left">
              <p
                className={`text-sm font-medium ${i === 0 ? "text-white" : "text-white/70"}`}
              >
                {step.title}
              </p>
              <p className="text-xs text-emerald-100/70">{step.description}</p>
            </div>
          </div>
        ))}

        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/30 px-3 py-1">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          <span className="text-xs font-medium text-white">
            Free to start · No credit card
          </span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password") ?? "";
  const checks = [
    { label: "At least 10 characters", passed: password.length >= 10 },
    { label: "One uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "One lowercase letter", passed: /[a-z]/.test(password) },
    { label: "One number", passed: /[0-9]/.test(password) },
    { label: "One special character", passed: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data?.fieldErrors?.email?.[0] ??
          data?.error ??
          "Unable to create account. Please try again.";
        setFormError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      reset();
      setSuccessMessage(
        "Account created! Check your email to verify your address before signing in.",
      );
    } catch (error) {
      console.error(error);
      const errorMsg = "Something went wrong. Please try again.";
      setFormError(errorMsg);
      toast.error(errorMsg);
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
              Create an Account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join TaxEase and simplify your Nigerian tax filings.
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
                htmlFor="name"
                className="text-sm font-medium text-slate-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Amaka Osei"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                {...register("name")}
              />
              {errors.name?.message ? (
                <p className="text-[11px] text-red-600">{errors.name.message}</p>
              ) : null}
            </div>

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

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-500 hover:text-emerald-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
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
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 pr-12 text-sm text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs font-medium text-slate-500 hover:text-emerald-700"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword?.message ? (
                <p className="text-[11px] text-red-600">
                  {errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <p className="text-xs text-slate-500">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="font-medium text-slate-700 underline underline-offset-2 hover:text-emerald-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-slate-700 underline underline-offset-2 hover:text-emerald-700"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-900 active:scale-[0.98] disabled:opacity-60"
            >
              {isSubmitting ? (
                "Creating account..."
              ) : (
                <>
                  Create Account{" "}
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
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Log In
              </button>
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
          <OnboardingPreviewCard />

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              Get started in minutes
            </h2>
            <p className="text-sm text-emerald-100">
              Your complete Nigerian tax compliance workspace
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
