"use client";

import { Lead } from "@/lib/types";
import {
  displayName,
  formatDuration,
  formatPhone,
  parseProducts,
  parseTranscript,
  relativeTimeHi,
  statusClasses,
  statusLabel,
  waLink,
} from "@/lib/lead-utils";

export function LeadDetail({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose?: () => void;
}) {
  const name = displayName(lead);
  const products = parseProducts(lead.products);
  const sc = statusClasses(lead.status);
  const wa = waLink(lead);
  const chat = parseTranscript(lead.transcript);
  const duration = formatDuration(lead.call_duration);

  return (
    <div className="card p-5 lg:p-6 flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={[
                "inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full border",
                sc.badge,
              ].join(" ")}
            >
              <span className={`dot ${sc.dot}`} />
              {statusLabel(lead.status)}
            </span>
            <span className="text-[12px] text-muted">
              {relativeTimeHi(lead.created_at)}
            </span>
            {duration ? (
              <span className="text-[12px] text-muted">· {duration} call</span>
            ) : null}
          </div>
          <div className="mt-2 font-display text-[24px] leading-tight text-ink">
            {name}
          </div>
          {lead.caller_name && lead.caller_number ? (
            <div className="text-[13px] text-muted">
              {formatPhone(lead.caller_number) ?? lead.caller_number}
            </div>
          ) : null}
        </div>
        {onClose ? (
          <button
            onClick={onClose}
            className="lg:hidden text-muted hover:text-ink text-sm border border-line rounded-full px-3 py-1"
            aria-label="Close"
          >
            Band karo
          </button>
        ) : null}
      </div>

      {products ? (
        <div>
          <Label>Order</Label>
          <div className="text-[15px] text-terracotta-dark font-medium">
            {products}
          </div>
        </div>
      ) : null}

      {lead.order_summary ? (
        <div>
          <Label>Summary</Label>
          <div className="quote-box">{lead.order_summary}</div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 text-[13px]">
        {lead.location ? (
          <InfoRow label="Location" value={lead.location} />
        ) : null}
        {lead.amount ? <InfoRow label="Amount" value={`₹${lead.amount}`} /> : null}
        {duration ? <InfoRow label="Call duration" value={duration} /> : null}
        {lead.agent_id ? (
          <InfoRow label="Agent" value={lead.agent_id} mono />
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {wa ? (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-wa hover:bg-wa-dark text-white text-[14px] font-medium px-4 py-2 rounded-full transition-colors"
          >
            WhatsApp pe bhejo
          </a>
        ) : null}
        {lead.recording_url ? (
          <a
            href={lead.recording_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-line text-ink-soft hover:bg-cream-2 text-[14px] px-4 py-2 rounded-full transition-colors"
          >
            🔊 Recording suno
          </a>
        ) : null}
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <Label>Call transcript</Label>
        <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-line bg-cream-2/60 p-3 space-y-2">
          {chat.length === 0 ? (
            <div className="text-[13px] text-muted p-3">
              Transcript abhi available nahi hai.
            </div>
          ) : (
            chat.map((line, i) => (
              <div
                key={i}
                className={[
                  "flex",
                  line.role === "user" ? "justify-end" : "justify-start",
                ].join(" ")}
              >
                <div
                  className={[
                    "max-w-[80%] px-3 py-2 rounded-2xl text-[14px] leading-snug whitespace-pre-wrap",
                    line.role === "user"
                      ? "bg-wa text-white rounded-br-md"
                      : line.role === "assistant"
                        ? "bg-white border border-line text-ink rounded-bl-md"
                        : "bg-stone-100 text-muted text-[12.5px] italic",
                  ].join(" ")}
                >
                  {line.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-wider text-muted mb-1.5">
      {children}
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-cream-2/40 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-muted">
        {label}
      </div>
      <div
        className={[
          "text-[13.5px] text-ink mt-0.5 truncate",
          mono ? "font-mono text-[12px]" : "",
        ].join(" ")}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}
