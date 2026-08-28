// 관리자 대시보드 공용 UI 조각들 (서버 컴포넌트).

import Link from "next/link";
import { channelLabel } from "@/lib/analytics/channel";

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[24px] font-bold tracking-[-0.02em] text-ink">{value}</p>
      {sub ? <p className="mt-0.5 text-[12px] text-muted">{sub}</p> : null}
    </div>
  );
}

const PERIODS = [
  { days: 7, label: "7일" },
  { days: 30, label: "30일" },
  { days: 90, label: "90일" },
] as const;

export function PeriodSelector({ basePath, days }: { basePath: string; days: number }) {
  return (
    <div className="flex gap-1 rounded-lg border border-line bg-white p-1">
      {PERIODS.map((period) => (
        <Link
          key={period.days}
          href={`${basePath}?days=${period.days}`}
          className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition ${
            days === period.days
              ? "bg-ink text-white"
              : "text-muted hover:bg-cream"
          }`}
        >
          {period.label}
        </Link>
      ))}
    </div>
  );
}

export function parseDays(value: string | string[] | undefined): number {
  const n = Number(Array.isArray(value) ? value[0] : value);
  return n === 7 || n === 30 || n === 90 ? n : 30;
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
      {description ? (
        <p className="mt-0.5 text-[12px] text-muted">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** 수평 막대 목록 — 값 비교용. */
export function BarList({
  rows,
}: {
  rows: Array<{ label: string; value: number; sub?: string }>;
}) {
  const max = Math.max(1, ...rows.map((row) => row.value));
  return (
    <ul className="space-y-2">
      {rows.map((row, index) => (
        <li key={`${row.label}-${index}`}>
          <div className="flex items-baseline justify-between gap-3 text-[13px]">
            <span className="truncate text-ink">{row.label}</span>
            <span className="shrink-0 font-medium text-ink">
              {row.value.toLocaleString()}
              {row.sub ? <span className="ml-1 text-[11px] text-muted">{row.sub}</span> : null}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-cream">
            <div
              className="h-full rounded-full bg-gold-deep"
              style={{ width: `${Math.max(2, (row.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
      {rows.length === 0 ? (
        <li className="text-[13px] text-muted">아직 데이터가 없습니다.</li>
      ) : null}
    </ul>
  );
}

export function ChannelBadge({ channel }: { channel: string | null }) {
  return (
    <span className="inline-flex items-center rounded-full bg-cream px-2 py-0.5 text-[12px] font-medium text-ink">
      {channelLabel(channel)}
    </span>
  );
}

export const tableClass = "w-full border-collapse text-[13px]";
export const thClass =
  "border-b border-line px-2 py-2 text-left text-[12px] font-medium text-muted whitespace-nowrap";
export const tdClass = "border-b border-line/60 px-2 py-2 align-top";
