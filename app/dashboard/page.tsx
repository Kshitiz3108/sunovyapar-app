"use client";

import { useMemo, useState } from "react";
import { useLeads } from "@/lib/useLeads";
import { LeadCard } from "@/components/LeadCard";
import { LeadDetail } from "@/components/LeadDetail";
import { LivePill, PageHeader } from "@/components/PageHeader";
import { isToday } from "@/lib/lead-utils";
import { LeadStatus } from "@/lib/types";

type Filter = "all" | LeadStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Saare" },
  { key: "serious", label: "Serious" },
  { key: "pending", label: "Follow-up" },
  { key: "not_serious", label: "Serious nahi" },
];

export default function DashboardPage() {
  const {
    leads,
    loading,
    error,
    configured,
    newLeadId,
    newLeadToast,
    clearToast,
  } = useLeads();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const tally = useMemo(() => {
    const today = leads.filter((l) => isToday(l.created_at));
    return {
      total: today.length,
      serious: today.filter((l) => l.status === "serious").length,
      pending: today.filter((l) => l.status === "pending").length,
    };
  }, [leads]);

  const filtered = useMemo(() => {
    if (filter === "all") return leads;
    return leads.filter((l) => l.status === filter);
  }, [leads, filter]);

  const selected =
    leads.find((l) => l.id === selectedId) ??
    (filtered.length ? filtered[0] : null);

  return (
    <div className="lg:flex lg:gap-6 lg:px-6 lg:py-4">
      <section className="lg:w-[400px] xl:w-[440px] lg:shrink-0 flex flex-col min-h-0">
        <PageHeader
          title="Aaj ke leads"
          subtitle="Shree Ram Distributors · Ishita AI"
          right={<LivePill />}
        />

        <div className="px-4 lg:px-0">
          <TodayTally
            total={tally.total}
            serious={tally.serious}
            pending={tally.pending}
          />
        </div>

        <div className="px-4 lg:px-0 mt-3 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className="pill"
              data-active={filter === f.key}
            >
              {f.label}
              {f.key !== "all" ? (
                <span className="text-[11px] opacity-70 ml-1">
                  {leads.filter((l) => l.status === f.key).length}
                </span>
              ) : (
                <span className="text-[11px] opacity-70 ml-1">
                  {leads.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="px-4 lg:px-0 mt-3 lg:mt-4 flex-1 min-h-0 lg:overflow-y-auto lg:pr-1 space-y-3 pb-4">
          {!configured ? (
            <SetupNotice />
          ) : error ? (
            <ErrorBox message={error} />
          ) : loading ? (
            <LoadingList />
          ) : filtered.length === 0 ? (
            <EmptyState hasAny={leads.length > 0} />
          ) : (
            filtered.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                isNew={lead.id === newLeadId}
                selected={selected?.id === lead.id}
                onSelect={(id) => {
                  setSelectedId(id);
                  setMobileDetailOpen(true);
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* Desktop detail pane */}
      <aside className="hidden lg:flex flex-1 min-w-0 sticky top-4 self-start h-[calc(100vh-2rem)]">
        {selected ? (
          <div className="flex-1 min-w-0">
            <LeadDetail lead={selected} />
          </div>
        ) : (
          <div className="flex-1 card flex items-center justify-center text-muted text-sm p-8 text-center">
            Lead pe click karo — yahan poori detail aur transcript dikhega.
          </div>
        )}
      </aside>

      {/* Mobile detail overlay */}
      {mobileDetailOpen && selected ? (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 p-3 pt-10 flex"
          onClick={() => setMobileDetailOpen(false)}
        >
          <div
            className="flex-1 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <LeadDetail
              lead={selected}
              onClose={() => setMobileDetailOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {/* New lead toast */}
      {newLeadToast ? (
        <div className="fixed bottom-[92px] lg:bottom-6 right-4 z-50 toast">
          <div className="card bg-ink text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 min-w-[240px]">
            <span className="dot bg-wa pulse-dot text-wa" />
            <div className="flex-1">
              <div className="text-[13.5px] font-medium">Naya lead aaya</div>
              <div className="text-[12px] text-white/70 truncate">
                {newLeadToast.name}
              </div>
            </div>
            <button
              onClick={clearToast}
              className="text-white/60 hover:text-white text-xs"
              aria-label="dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TodayTally({
  total,
  serious,
  pending,
}: {
  total: number;
  serious: number;
  pending: number;
}) {
  return (
    <div className="card p-3 lg:p-4">
      <div className="flex items-baseline justify-between">
        <div className="font-display text-[15.5px] text-ink-soft">
          <span className="devnagri text-ink">आज का हिसाब</span>
          <span className="text-muted text-[12.5px] ml-2">today</span>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Stat label="Total calls" value={total} tone="ink" />
        <Stat label="Serious" value={serious} tone="serious" />
        <Stat label="Follow-up" value={pending} tone="pending" />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ink" | "serious" | "pending";
}) {
  const toneCls =
    tone === "serious"
      ? "text-serious"
      : tone === "pending"
        ? "text-pending"
        : "text-ink";
  return (
    <div className="rounded-xl border border-line bg-cream-2/50 px-3 py-2.5">
      <div className={`font-display text-[24px] leading-none ${toneCls}`}>
        {value}
      </div>
      <div className="text-[11.5px] text-muted mt-1">{label}</div>
    </div>
  );
}

function LoadingList() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="card p-4 animate-pulse"
          style={{ opacity: 0.7 - i * 0.15 }}
        >
          <div className="h-3 w-24 bg-line rounded" />
          <div className="h-4 w-40 bg-line rounded mt-3" />
          <div className="h-3 w-3/4 bg-line rounded mt-3" />
          <div className="h-3 w-2/3 bg-line rounded mt-2" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="card p-6 text-center">
      <div className="text-3xl mb-2">📞</div>
      <div className="font-display text-[18px] text-ink">
        {hasAny ? "Is filter mein koi lead nahi" : "Abhi koi call nahi aayi"}
      </div>
      <div className="text-[13px] text-muted mt-1">
        {hasAny
          ? "Doosra filter try karo."
          : "Pehli call aate hi yahan dikhega."}
      </div>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="card p-4 border-amber-200 bg-amber-50">
      <div className="font-medium text-amber-900 text-sm">
        Supabase se data nahi aa raha
      </div>
      <div className="text-[12.5px] text-amber-800 mt-1 break-words">
        {message}
      </div>
      <div className="text-[12.5px] text-amber-900 mt-2">
        Tip: RLS enable hai? Run:
        <pre className="mt-1 whitespace-pre-wrap text-[11.5px] bg-white border border-amber-200 rounded p-2">{`alter table leads enable row level security;
create policy "public read leads" on leads for select using (true);`}</pre>
      </div>
    </div>
  );
}

function SetupNotice() {
  return (
    <div className="card p-5">
      <div className="font-display text-[18px] text-ink">
        Connect Supabase to go live
      </div>
      <div className="text-[13px] text-muted mt-1">
        Create a <code className="text-ink-soft">.env.local</code> at the
        project root and add:
      </div>
      <pre className="mt-3 text-[12px] bg-cream-2 border border-line rounded-lg p-3 overflow-x-auto">{`NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY`}</pre>
      <div className="text-[12.5px] text-muted mt-3">
        Then restart <code>npm run dev</code>. Use the{" "}
        <strong>anon public</strong> key — not the service role key.
      </div>
      <div className="text-[12.5px] text-muted mt-3">
        If reads are blocked by RLS, run this SQL in Supabase:
      </div>
      <pre className="mt-1 text-[12px] bg-cream-2 border border-line rounded-lg p-3 overflow-x-auto">{`alter table leads enable row level security;
create policy "public read leads" on leads for select using (true);`}</pre>
    </div>
  );
}
