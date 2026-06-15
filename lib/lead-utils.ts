import { Lead, LeadStatus } from "./types";

export function parseProducts(productsField: unknown): string | null {
  if (productsField == null) return null;

  if (typeof productsField === "object") {
    if (Array.isArray(productsField)) {
      const joined = productsField
        .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
        .filter(Boolean)
        .join(", ");
      return joined || null;
    }
    const obj = productsField as Record<string, unknown>;
    const raw = obj.raw;
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    return null;
  }

  if (typeof productsField !== "string") return null;
  const raw = productsField.trim();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const v = (parsed as { raw?: unknown }).raw;
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    if (Array.isArray(parsed)) {
      const joined = parsed
        .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
        .filter(Boolean)
        .join(", ");
      return joined || null;
    }
    if (typeof parsed === "string" && parsed.trim()) return parsed.trim();
    return raw;
  } catch {
    return raw;
  }
}

export function displayName(lead: Pick<Lead, "caller_name" | "caller_number">): string {
  const name = lead.caller_name?.trim();
  if (name) return name;
  const num = lead.caller_number?.trim();
  if (num) return num;
  return "Unknown caller";
}

export function relativeTimeHi(dateIso: string, now: Date = new Date()): string {
  const t = new Date(dateIso).getTime();
  if (Number.isNaN(t)) return "";
  const diffSec = Math.max(0, Math.floor((now.getTime() - t) / 1000));
  if (diffSec < 45) return "abhi abhi";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min pehle`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} ghante pehle`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} din pehle`;
  return new Date(dateIso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function formatDuration(sec: number | null): string | null {
  if (sec == null) return null;
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

export function isToday(iso: string, now: Date = new Date()): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function statusLabel(s: LeadStatus | null | undefined): string {
  switch (s) {
    case "serious":
      return "Serious Buyer";
    case "pending":
      return "Follow-up";
    case "not_serious":
      return "Serious Nahi";
    default:
      return "—";
  }
}

export function statusClasses(s: LeadStatus | null | undefined): {
  badge: string;
  dot: string;
} {
  switch (s) {
    case "serious":
      return {
        badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
        dot: "bg-serious",
      };
    case "pending":
      return {
        badge: "bg-amber-50 text-amber-800 border-amber-200",
        dot: "bg-pending",
      };
    case "not_serious":
      return {
        badge: "bg-stone-100 text-stone-600 border-stone-200",
        dot: "bg-not-serious",
      };
    default:
      return {
        badge: "bg-stone-50 text-stone-500 border-stone-200",
        dot: "bg-not-serious",
      };
  }
}

export function waLink(lead: Lead): string | null {
  const num = (lead.caller_number || "").replace(/[^\d+]/g, "");
  if (!num) return null;
  const cleaned = num.startsWith("+") ? num.slice(1) : num;
  const who = lead.caller_name?.trim() || "ji";
  const summary = lead.order_summary?.trim() || "Aapka order confirm karna tha.";
  const msg = `Namaste ${who} 🙏\n\nShree Ram Distributors se. Aapne abhi humari AI assistant Ishita se baat ki thi.\n\nOrder: ${summary}\n\nDelivery ka time aur address confirm kar dijiye please.`;
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(msg)}`;
}

export type ChatLine = { role: "assistant" | "user" | "system"; text: string };

export function parseTranscript(raw: string | null): ChatLine[] {
  if (!raw) return [];
  const lines = raw.split(/\r?\n/);
  const out: ChatLine[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const m = trimmed.match(/^(assistant|user|system)\s*:\s*(.*)$/i);
    if (m) {
      const role = m[1].toLowerCase() as ChatLine["role"];
      const text = m[2].trim();
      if (text) out.push({ role, text });
    } else if (out.length) {
      out[out.length - 1].text += " " + trimmed;
    } else {
      out.push({ role: "assistant", text: trimmed });
    }
  }
  return out;
}

export function avatarColor(seed: string): string {
  const palette = [
    "#cf6a33",
    "#b88a2d",
    "#16a34a",
    "#3b82f6",
    "#7c3aed",
    "#db2777",
    "#0f766e",
  ];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

export function avatarInitial(name: string): string {
  const t = name.trim();
  if (!t) return "?";
  if (/^[+\d]/.test(t)) return "☎";
  return t[0].toUpperCase();
}
