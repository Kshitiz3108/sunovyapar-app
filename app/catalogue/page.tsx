import { PageHeader } from "@/components/PageHeader";
import { CATALOGUE } from "@/lib/seed";

export default function CataloguePage() {
  return (
    <div className="lg:px-6 lg:py-4">
      <PageHeader
        title="Catalogue"
        subtitle="Ishita yeh items bechti hai — bolne ka tareeqa, size, aur rate."
      />
      <div className="px-4 lg:px-0 mt-2 space-y-2 pb-6">
        {CATALOGUE.map((item) => (
          <div key={item.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-[17px] text-ink leading-tight">
                  {item.name}
                </div>
                <div className="text-[12.5px] text-muted mt-1">
                  🔊 bolega:{" "}
                  <span className="text-terracotta-dark font-medium">
                    “{item.spoken}”
                  </span>
                </div>
              </div>
              {item.volatile ? (
                <span className="shrink-0 text-[11px] uppercase tracking-wider px-2 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800">
                  Volatile · saheb se
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-soft">
              {item.variant ? <span>{item.variant}</span> : null}
              {item.rate ? (
                <span className="font-medium text-ink">{item.rate}</span>
              ) : (
                <span className="text-muted italic">Rate: saheb se poochho</span>
              )}
            </div>
          </div>
        ))}
        <div className="text-center text-[11.5px] text-muted pt-2">
          Yeh catalogue abhi hardcoded hai — baad mein <code>catalogue</code>{" "}
          table se aayega.
        </div>
      </div>
    </div>
  );
}
