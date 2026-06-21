"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PLATFORM } from "@/lib/brand";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push("/login"), 1500);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <button
      type="button"
      onClick={() => router.push("/login")}
      aria-label="Continue"
      className="min-h-screen w-full flex flex-col items-center justify-center bg-cream px-6 cursor-pointer"
    >
      <div className="splash-in flex flex-col items-center text-center">
        <div className="font-display text-[40px] sm:text-[48px] leading-none text-ink tracking-tight">
          Suno<span className="text-terracotta">Vyapar</span>
        </div>
        <div className="mt-4 text-[15px] text-muted">
          {PLATFORM.tagline}
        </div>
        <div className="mt-1 text-[12.5px] text-muted/70 italic">
          {PLATFORM.taglineEn}
        </div>
      </div>

      <div className="splash-in absolute bottom-12 flex items-center gap-1.5">
        <span className="splash-dot" style={{ animationDelay: "0ms" }} />
        <span className="splash-dot" style={{ animationDelay: "160ms" }} />
        <span className="splash-dot" style={{ animationDelay: "320ms" }} />
      </div>
    </button>
  );
}
