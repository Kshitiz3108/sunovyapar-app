"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
      {/* Full logo — already includes tagline and descriptor pill */}
      <img
        src="/assets/sunovyapar-logo.jpg"
        alt="SunoVyapar — Never Miss a Customer"
        className="splash-logo w-[240px] sm:w-[280px] max-w-[80vw] select-none"
        draggable={false}
      />

      <div className="absolute bottom-12 flex items-center gap-1.5">
        <span className="splash-dot" style={{ animationDelay: "0ms" }} />
        <span className="splash-dot" style={{ animationDelay: "160ms" }} />
        <span className="splash-dot" style={{ animationDelay: "320ms" }} />
      </div>
    </button>
  );
}
