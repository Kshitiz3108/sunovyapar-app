import { PageHeader } from "@/components/PageHeader";
import { STOCK, StockState } from "@/lib/seed";

const TONE: Record<
  StockState,
  { label: string; dot: string; pill: string }
> = {
  in_stock: {
    label: "Stock hai",
    dot: "bg-serious",
    pill: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  low: {
    label: "Kam hai",
    dot: "bg-pending",
    pill: "bg-amber-50 text-amber-800 border-amber-200",
  },
  out: {
    label: "Khatam",
    dot: "bg-rose-500",
    pill: "bg-rose-50 text-rose-800 border-rose-200",
  },
};

export default function StockPage() {
  return (
    <div className="lg:px-6 lg:py-4">
      <PageHeader
        title="Stock"
        subtitle="Jaldi nazar — kya hai, kya kam hai, kya khatam."
      />
      <div className="px-4 lg:px-0 mt-2 space-y-2 pb-6">
        {STOCK.map((item) => {
          const tone = TONE[item.state];
          return (
            <div
              key={item.id}
              className="card p-4 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="font-display text-[16.5px] text-ink truncate">
                  {item.name}
                </div>
                <div className="text-[12.5px] text-muted mt-0.5">
                  {item.qty}
                </div>
              </div>
              <span
                className={[
                  "inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full border shrink-0",
                  tone.pill,
                ].join(" ")}
              >
                <span className={`dot ${tone.dot}`} />
                {tone.label}
              </span>
            </div>
          );
        })}
        <div className="text-center text-[11.5px] text-muted pt-2">
          Stock abhi seed data hai — baad mein <code>stock</code> table se aayega.
        </div>
      </div>
    </div>
  );
}
