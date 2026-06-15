import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="px-4 lg:px-8 pt-5 lg:pt-7 pb-3 flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[26px] lg:text-[30px] leading-tight text-ink">
          {title}
        </h1>
        {subtitle ? (
          <div className="text-[13px] lg:text-[14px] text-muted mt-1">
            {subtitle}
          </div>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export function LivePill() {
  return (
    <span className="pill" data-active="false">
      <span className="dot bg-wa pulse-dot text-wa" />
      <span className="text-[12.5px]">Live · AI calls aa rahi hain</span>
    </span>
  );
}
