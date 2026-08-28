import Link from "next/link";
import {
  ChannelBadge,
  SectionCard,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { INQUIRY_STATUS_LABELS, fmtDateTime } from "@/lib/analytics/format";
import { getInquiries } from "@/lib/analytics/queries";

const FILTERS = [
  { value: "", label: "전체" },
  { value: "new", label: "신규" },
  { value: "contacted", label: "연락 완료" },
  { value: "converted", label: "계약 전환" },
  { value: "closed", label: "종료" },
] as const;

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-gold text-ink",
    contacted: "bg-ink text-white",
    converted: "bg-gold-deep text-ink",
    closed: "bg-line text-muted",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[12px] font-medium ${styles[status] ?? "bg-cream text-ink"}`}
    >
      {INQUIRY_STATUS_LABELS[status] ?? status}
    </span>
  );
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : "";

  const inquiries = await getInquiries(status || undefined);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold text-ink">문의 목록</h1>
        <div className="flex gap-1 rounded-lg border border-line bg-white p-1">
          {FILTERS.map((filter) => (
            <Link
              key={filter.value}
              href={filter.value ? `/admin/inquiries?status=${filter.value}` : "/admin/inquiries"}
              className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition ${
                status === filter.value ? "bg-ink text-white" : "text-muted hover:bg-cream"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>
      </div>

      <SectionCard
        title={`최근 문의 ${inquiries.length}건`}
        description="행을 누르면 유입 경로와 방문 여정 전체를 볼 수 있습니다. ‘경로(자기보고)’는 고객이 폼에 직접 고른 값, ‘채널(측정)’은 실제 유입 데이터입니다."
      >
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>접수</th>
                <th className={thClass}>업장명</th>
                <th className={thClass}>지역</th>
                <th className={thClass}>연락처</th>
                <th className={thClass}>채널(측정)</th>
                <th className={thClass}>경로(자기보고)</th>
                <th className={thClass}>검색어</th>
                <th className={thClass}>방문</th>
                <th className={thClass}>상태</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="transition hover:bg-cream/60">
                  <td className={`${tdClass} whitespace-nowrap`}>
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="font-medium text-gold-text hover:underline"
                    >
                      {fmtDateTime(inquiry.createdAt)}
                    </Link>
                    {!inquiry.mailSent ? (
                      <span className="ml-1 rounded bg-[#e11d2e]/10 px-1 py-0.5 text-[11px] text-[#e11d2e]">
                        메일 실패
                      </span>
                    ) : null}
                  </td>
                  <td className={`${tdClass} font-medium`}>
                    <Link href={`/admin/inquiries/${inquiry.id}`} className="hover:underline">
                      {inquiry.store}
                    </Link>
                  </td>
                  <td className={tdClass}>{inquiry.region ?? "-"}</td>
                  <td className={`${tdClass} whitespace-nowrap`}>{inquiry.phone ?? "-"}</td>
                  <td className={tdClass}>
                    <ChannelBadge channel={inquiry.channel} />
                  </td>
                  <td className={tdClass}>{inquiry.selfSource ?? "-"}</td>
                  <td className={`${tdClass} max-w-[140px] truncate`}>
                    {inquiry.searchKeyword ?? "-"}
                  </td>
                  <td className={tdClass}>
                    {inquiry.visitNumber ? `${inquiry.visitNumber}회차` : "-"}
                  </td>
                  <td className={tdClass}>
                    <StatusBadge status={inquiry.status} />
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 ? (
                <tr>
                  <td className={tdClass} colSpan={9}>
                    아직 문의가 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
