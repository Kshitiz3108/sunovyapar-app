"use client";

import { useMemo } from "react";
import { useLeads } from "@/lib/useLeads";
import { PageHeader } from "@/components/PageHeader";
import { AGENT_CONFIG } from "@/lib/seed";
import { formatDuration } from "@/lib/lead-utils";

export default function AgentPage() {
  const { leads } = useLeads();

  const stats = useMemo(() => {
    const total = leads.length;
    const serious = leads.filter((l) => l.status === "serious").length;
    const seriousPct = total ? Math.round((serious / total) * 100) : 0;
    const withDur = leads.filter(
      (l) => typeof l.call_duration === "number" && (l.call_duration ?? 0) > 0,
    );
    const avg =
      withDur.length === 0
        ? null
        : Math.round(
            withDur.reduce((s, l) => s + (l.call_duration || 0), 0) /
              withDur.length,
          );
    return { total, seriousPct, avg };
  }, [leads]);

  return (
    <div className="lg:px-6 lg:py-4">
      <PageHeader
        title="AI Agent"
        subtitle="Aapki taraf se calls le rahi hai."
      />

      <div className="px-4 lg:px-0 mt-2 space-y-4 pb-6 max-w-2xl">
        {/* Dark hero */}
        <div
          className="rounded-[22px] p-5 lg:p-6 text-white relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1f1a14 0%, #2c2418 55%, #3a2a16 100%)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-terracotta/90 flex items-center justify-center font-display text-[26px]">
              I
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-display text-[24px] leading-tight">
                {AGENT_CONFIG.name}
              </div>
              <div className="mt-1 inline-flex items-center gap-2 text-[12.5px] text-white/80">
                <span className="dot bg-wa pulse-dot text-wa" />
                ON · calls le rahi hai
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <HeroStat label="Total calls" value={String(stats.total)} />
            <HeroStat label="% serious" value={`${stats.seriousPct}%`} />
            <HeroStat
              label="Avg duration"
              value={stats.avg == null ? "—" : (formatDuration(stats.avg) ?? "—")}
            />
          </div>
        </div>

        {/* Config */}
        <div className="card divide-y divide-line">
          <ConfigRow label="Number" value={AGENT_CONFIG.number} />
          <ConfigRow
            label="WhatsApp alerts"
            value={AGENT_CONFIG.whatsappAlerts}
          />
          <ConfigRow label="Catalogue" value={AGENT_CONFIG.catalogue} />
          <ConfigRow label="Working hours" value={AGENT_CONFIG.hours} />
        </div>

        <div className="text-center text-[11.5px] text-muted">
          Config values abhi static hain — Bolna agent settings se sync hoga.
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 px-3 py-2.5">
      <div className="font-display text-[22px] leading-none">{value}</div>
      <div className="text-[11px] text-white/70 mt-1">{label}</div>
    </div>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-3">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="text-[13.5px] text-ink font-medium text-right">
        {value}
      </div>
    </div>
  );
}
