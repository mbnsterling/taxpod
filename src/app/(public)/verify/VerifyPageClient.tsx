 "use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Inbox,
  Link2,
  Zap,
  ArrowRight,
} from "lucide-react";

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

function VerificationPreviewCard({
  status,
}: {
  status: "idle" | "loading" | "success" | "error";
}) {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-lg">
      <div className="space-y-4">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 ${
            status === "success"
              ? "bg-white/30"
              : status === "error"
                ? "bg-red-400/30"
                : "bg-white/20"
          }`}
        >
          {status === "success" ? (
            <CheckCircle2 className="h-8 w-8 text-white" />
          ) : status === "error" ? (
            <XCircle className="h-8 w-8 text-white" />
          ) : status === "loading" ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          ) : (
            <Mail className="h-8 w-8 text-white" />
          )}
        </div>

        <div className="space-y-3">
          <p className="text-left text-lg font-semibold text-white">
            {status === "success"
              ? "Email verified!"
              : status === "error"
                ? "Verification failed"
                : status === "loading"
                  ? "Verifying your email..."
                  : "Email verification"}
          </p>

          {[
            {
              icon: <Inbox className="h-4 w-4 shrink-0 text-emerald-200" />,
              title: "Check your inbox",
              desc: "We send a unique link to your registered email.",
            },
            {
              icon: <Link2 className="h-4 w-4 shrink-0 text-emerald-200" />,
              title: "Click the link",
              desc: "The link is valid for 24 hours after it was sent.",
            },
            {
              icon: <Zap className="h-4 w-4 shrink-0 text-emerald-200" />,
              title: "Start filing",
              desc: "Access PIT, PAYE, and VAT tools right away.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5">{item.icon}</span>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-emerald-100/80">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("Verification link is missing or invalid.");
        return;
      }

      setStatus("loading");
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          setStatus("error");
          setMessage(
            data?.error ??
              "Verification link is invalid or has expired. Request a new one from your account.",
          );
          return;
        }

        setStatus("success");
        setMessage("Email verified. You can now sign in to your account.");
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }

    void verify();
  }, [token]);

  return (
    <div className="flex min-h-screen">
      {/* Left: Status Panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white px-8 py-12 lg:px-16">
        <div className="w-full max-w-sm">
          <TaxEaseLogo />

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-900">
              Verify your Email
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              We&apos;re confirming this email belongs to you before activating
              your TaxEase account.
            </p>
          </div>

          <div className="space-y-5">
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                status === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : status === "error"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-slate-200 bg-slate-50 text-slate-700"
              }`}
            >
              {status === "loading" && (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                  Verifying your email, please wait...
                </span>
              )}
              {status !== "loading" && message}
              {status === "idle" && !message && "Starting verification..."}
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-900 active:scale-[0.98] disabled:opacity-60"
            >
              Go to Login
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-sm text-slate-500">
              Didn&apos;t receive an email?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Register again
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Visual Panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18)_0,_transparent_50%)]" />
        <div className="absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-emerald-300/15 blur-2xl" />

        <div className="relative flex flex-col items-center gap-8 px-12 text-center">
          <VerificationPreviewCard status={status} />

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Almost there!</h2>
            <p className="text-sm text-emerald-100">
              One quick step to activate your TaxEase account
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-6 rounded-full bg-white" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

