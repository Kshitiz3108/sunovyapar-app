"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BUSINESS, PLATFORM } from "@/lib/brand";

export default function LoginPage() {
  const router = useRouter();

  // Demo only — any input (or none) logs in. Purely cosmetic navigation.
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cream px-6 py-10">
      <div className="w-full max-w-[380px] flex flex-col items-center">
        {/* Business identity — the tenant logging into their space */}
        <div className="h-20 w-20 rounded-2xl bg-terracotta text-white flex items-center justify-center shadow-md">
          <span className="font-display devnagri text-[26px] leading-none">
            {BUSINESS.monogram}
          </span>
        </div>
        <h1 className="mt-5 font-display text-[28px] leading-tight text-ink text-center">
          {BUSINESS.name}
        </h1>
        <div className="mt-1 text-[13px] text-muted text-center">
          {BUSINESS.tagline} · {BUSINESS.location}
        </div>

        <form onSubmit={handleSubmit} className="w-full mt-8 space-y-3">
          <div>
            <label className="block text-[12.5px] text-ink-soft mb-1.5 ml-1">
              Phone ya username
            </label>
            <input
              type="text"
              inputMode="tel"
              autoComplete="off"
              placeholder="98765 43210"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition"
            />
          </div>
          <div>
            <label className="block text-[12.5px] text-ink-soft mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              autoComplete="off"
              placeholder="••••••••"
              className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-terracotta hover:bg-terracotta-dark text-white text-[15.5px] font-medium py-3.5 mt-2 transition-colors shadow-sm"
          >
            Login karo
          </button>
        </form>

        <div className="mt-5 text-[12px] text-muted text-center">
          Apna dhanda dekho — leads, calls, sab ek jagah.
        </div>
      </div>

      {/* Quiet platform frame */}
      <div className="mt-10 text-[11.5px] text-muted/70">
        powered by{" "}
        <span className="font-medium text-ink-soft">{PLATFORM.name}</span>
      </div>
    </div>
  );
}
