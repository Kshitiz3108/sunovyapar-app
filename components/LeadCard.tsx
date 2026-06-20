"use client";

import { Lead } from "@/lib/types";
import {
  displayName,
  parseProducts,
  relativeTimeHi,
  statusClasses,
  statusLabel,
  waLink,
} from "@/lib/lead-utils";

export function LeadCard({
  lead,
  isNew,
  selected,
  onSelect,
}: {
  lead: Lead;
  isNew?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}) {
  const name = displayName(lead);
  const productsRaw = parseProducts(lead.products);
  const productItems = productsRaw
    ? productsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const sc = statusClasses(lead.status);
  const wa = waLink(lead);
  const showWa = lead.status === "serious" || lead.status === "pending";
  const showBottom = !!(lead.location || lead.amount || (showWa && wa));

  return (
    <article
      onClick={() => onSelect?.(lead.id)}
      className={[
        "card p-4 lg:p-5 cursor-pointer transition-transform",
        isNew ? "lead-new lead-highlight" : "",
        selected ? "ring-2 ring-terracotta/60" : "",
      ].join(" ")}
    >
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
        {isNew ? (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-terracotta text-white devnagri">
            नया
          </span>
        ) : null}
        <span className="text-[12px] text-muted ml-auto">
          {relativeTimeHi(lead.created_at)}
        </span>
      </div>

      <div className="mt-3">
        <div className="font-display text-[19px] leading-tight text-ink">
          {name}
        </div>
        {lead.caller_name && lead.caller_number ? (
          <div className="text-[12.5px] text-muted">{lead.caller_number}</div>
        ) : null}
      </div>

      {productItems.length > 0 ? (
        <ul className="mt-3 space-y-1.5 list-none">
          {productItems.map((item, i) => (
            <li
              key={i}
              className="flex gap-1.5 items-baseline text-[13.5px] text-terracotta-dark pl-2.5 border-l-2 border-terracotta/40"
            >
              <ProductLine item={item} />
            </li>
          ))}
        </ul>
      ) : null}

      {lead.order_summary ? (
        <div className="mt-2 quote-box">{lead.order_summary}</div>
      ) : null}

      {showBottom ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[12.5px] text-muted min-w-0">
            {lead.location ? (
              <span className="inline-flex items-center gap-1 truncate">
                <span aria-hidden>📍</span>
                <span className="truncate">{lead.location}</span>
              </span>
            ) : null}
            {lead.amount ? (
              <span className="inline-flex items-center gap-1">
                <span aria-hidden>₹</span>
                {lead.amount}
              </span>
            ) : null}
          </div>
          {showWa && wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 inline-flex items-center gap-1.5 bg-wa hover:bg-wa-dark text-white text-[13px] font-medium px-3 py-2 rounded-full transition-colors"
            >
              <WhatsAppGlyph />
              WhatsApp karo
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function ProductLine({ item }: { item: string }) {
  const trimmed = item.trim();
  // Bold the leading number + its unit word (e.g. "5 carton" in "5 carton Mangalore style")
  const m = trimmed.match(/^(\d[\d.,]*)(\s+\S+)?(.*)?$/);
  if (m) {
    const qty = m[1] + (m[2] || "");
    const rest = (m[3] || "").trim();
    return (
      <>
        <span className="font-bold">{qty}</span>
        {rest ? <span className="ml-0.5">{rest}</span> : null}
      </>
    );
  }
  return <span>{trimmed}</span>;
}

function WhatsAppGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.11 4.91A9.9 9.9 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.34 4.97L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.85-7.01ZM12.05 20.1h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.13.82.84-3.05-.2-.31a8.2 8.2 0 0 1-1.26-4.33c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.51-6.16c-.25-.12-1.46-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.37-1.7-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.04 0 1.2.87 2.36 1 2.52.12.16 1.72 2.63 4.18 3.69.58.25 1.04.4 1.4.51.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.18-.47-.3Z" />
    </svg>
  );
}
