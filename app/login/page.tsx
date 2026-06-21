"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PLATFORM } from "@/lib/brand";

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
        {/* Generic platform login */}
        <div className="font-display text-[30px] leading-none text-ink tracking-tight">
          Suno<span className="text-terracotta">Vyapar</span>
        </div>
        <div className="mt-2 text-[13px] text-muted text-center">
          Apne business mein login karo
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
      </div>

      {/* Quiet platform frame */}
      <div className="mt-10 text-[11.5px] text-muted/70">
        powered by{" "}
        <span className="font-medium text-ink-soft">{PLATFORM.name}</span>
      </div>
    </div>
  );
}
