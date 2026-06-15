"use client";

import { useMemo } from "react";
import { useLeads } from "@/lib/useLeads";
import { PageHeader } from "@/components/PageHeader";
import {
  avatarColor,
  avatarInitial,
  displayName,
  relativeTimeHi,
} from "@/lib/lead-utils";
import { Lead } from "@/lib/types";

type Customer = {
  key: string;
  number: string | null;
  name: string;
  location: string | null;
  calls: number;
  serious: number;
  lastAt: string;
  latest: Lead;
};

export default function CustomersPage() {
  const { leads, loading, configured } = useLeads();

  const customers = useMemo<Customer[]>(() => {
    const map = new Map<string, Customer>();
    for (const lead of leads) {
      const key = (lead.caller_number || `id:${lead.id}`).trim();
      const name = displayName(lead);
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          key,
          number: lead.caller_number,
          name,
          location: lead.location || null,
          calls: 1,
          serious: lead.status === "serious" ? 1 : 0,
          lastAt: lead.created_at,
          latest: lead,
        });
      } else {
        existing.calls += 1;
        if (lead.status === "serious") existing.serious += 1;
        if (new Date(lead.created_at) > new Date(existing.lastAt)) {
          existing.lastAt = lead.created_at;
          existing.latest = lead;
          if (lead.location) existing.location = lead.location;
          if (lead.caller_name?.trim()) existing.name = lead.caller_name.trim();
        }
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime(),
    );
  }, [leads]);

  return (
    <div className="lg:px-6 lg:py-4">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} unique callers`}
      />

      <div className="px-4 lg:px-0 mt-2 space-y-2 pb-6">
        {!configured ? (
          <Notice text="Supabase set up nahi hai — Leads page pe instructions hain." />
        ) : loading ? (
          <Notice text="Loading…" />
        ) : customers.length === 0 ? (
          <Notice text="Abhi koi customer nahi. Pehli call ke baad yahan dikhega." />
        ) : (
          customers.map((c) => <CustomerRow key={c.key} c={c} />)
        )}
      </div>
    </div>
  );
}

function CustomerRow({ c }: { c: Customer }) {
  const initial = avatarInitial(c.name);
  const bg = avatarColor(c.key);
  return (
    <div className="card p-3.5 lg:p-4 flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-display text-[18px] shrink-0"
        style={{ background: bg }}
        aria-hidden
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="font-display text-[16.5px] text-ink truncate">
            {c.name}
          </div>
          {c.serious > 0 ? (
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800">
              {c.serious} serious
            </span>
          ) : null}
        </div>
        <div className="text-[12.5px] text-muted truncate">
          {c.location ? `📍 ${c.location} · ` : ""}
          {c.calls} {c.calls === 1 ? "call" : "calls"} · last{" "}
          {relativeTimeHi(c.lastAt)}
        </div>
      </div>
      {c.number ? (
        <a
          href={`tel:${c.number}`}
          className="text-[12px] text-ink-soft border border-line rounded-full px-3 py-1.5 hover:bg-cream-2"
          aria-label={`call ${c.number}`}
        >
          ☎
        </a>
      ) : null}
    </div>
  );
}

function Notice({ text }: { text: string }) {
  return (
    <div className="card p-5 text-[13.5px] text-muted text-center">{text}</div>
  );
}
