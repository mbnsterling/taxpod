import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] font-sans">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-emerald-200 opacity-30 blur-[120px] transition-all duration-1000" />
        <div className="absolute right-[-5%] bottom-[-5%] h-[35%] w-[35%] rounded-full bg-blue-200 opacity-20 blur-[100px] transition-all duration-1000" />
        <div className="absolute top-[20%] right-[10%] h-[30%] w-[30%] rounded-full bg-amber-100 opacity-10 blur-[150px] transition-all duration-1000" />
      </div>

      <Navbar />
      <main className="relative">{children}</main>
      <Footer />

      {/* Floating chat button */}
      <div className="fixed right-10 bottom-10 z-50 flex flex-col gap-6">
        <button
          type="button"
          className="relative flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-emerald-800 text-white shadow-2xl shadow-emerald-900/40 transition-all duration-300 hover:bg-emerald-900"
          aria-label="Open support chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
          </svg>
          <span className="pointer-events-none absolute right-full mr-6 translate-x-4 rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm font-black text-slate-900 opacity-0 shadow-sm backdrop-blur-md transition-all group-hover:translate-x-0 group-hover:opacity-100">
            Need help? Chat now
          </span>
        </button>
      </div>
    </div>
  );
}
