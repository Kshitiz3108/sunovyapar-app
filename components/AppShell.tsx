"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

function IconLeads() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4h12a2 2 0 0 1 2 2v12l-4-3H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 12h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconCustomers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 19c.7-3.2 3-4.6 5.5-4.6S13.8 15.8 14.5 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle
        cx="16.5"
        cy="10"
        r="2.3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M14.8 14.6c.5-.2 1.1-.3 1.7-.3 2 0 3.6 1.1 4.1 3.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconCatalogue() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="5"
        width="16"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 5v14M16 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
function IconAgent() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3a4 4 0 0 0-4 4v3a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3M8.5 21h7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconStock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NAV: NavItem[] = [
  { href: "/", label: "Leads", icon: <IconLeads /> },
  { href: "/customers", label: "Customers", icon: <IconCustomers /> },
  { href: "/catalogue", label: "Catalogue", icon: <IconCatalogue /> },
  { href: "/agent", label: "Agent", icon: <IconAgent /> },
  { href: "/stock", label: "Stock", icon: <IconStock /> },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[230px] shrink-0 border-r border-line bg-cream sticky top-0 h-screen">
        <div className="px-5 pt-6 pb-5">
          <div className="font-display text-[22px] leading-none text-ink">
            SunoVyapar
          </div>
          <div className="text-[12.5px] text-muted mt-1">
            Shree Ram Distributors
          </div>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14.5px] transition-colors",
                  active
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-cream-2",
                ].join(" ")}
              >
                <span className="opacity-90">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 text-[11.5px] text-muted">
          <div className="flex items-center gap-2">
            <span className="dot bg-wa pulse-dot text-wa" />
            <span>Live · realtime on</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-[84px] lg:pb-0">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-line bg-cream/95 backdrop-blur pb-[env(safe-area-inset-bottom)]"
        aria-label="Primary"
      >
        <ul className="flex justify-between px-2">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  className={[
                    "flex flex-col items-center gap-0.5 py-2.5 text-[11px]",
                    active ? "text-terracotta" : "text-ink-soft",
                  ].join(" ")}
                >
                  <span>{item.icon}</span>
                  <span className="leading-none">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
