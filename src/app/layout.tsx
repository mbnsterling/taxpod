import "~/styles/globals.css";

import { type Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "TaxEase – File Nigerian Taxes Without Stress",
  description:
    "TaxEase makes filing Nigerian taxes simple and stress-free. Compliant with the Nigeria Tax Act 2025. Start for free today.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-[#f8fafc] text-slate-900 font-sans transition-colors duration-700 selection:bg-emerald-500 selection:text-white">
        <TRPCReactProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TRPCReactProvider>
      </body>
    </html>
  );
}
