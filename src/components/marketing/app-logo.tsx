import Link from "next/link";
import React from "react";

export const AppLogo = ({ href = "/" }: { href?: string }) => {
  return (
    <Link href={href} className="group flex cursor-pointer items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-lg font-black text-white shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
        T
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tight text-slate-900">
          TaxPod
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-emerald-500 uppercase">
          Nigeria
        </span>
      </div>
    </Link>
  );
};
