import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChannelBadge,
  SectionCard,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { updateInquiry } from "@/lib/admin-actions";
import { channelLabel } from "@/lib/analytics/channel";
import {
  INQUIRY_STATUS_LABELS,
  eventLabel,
  fmtDateTime,
  fmtDuration,
} from "@/lib/analytics/format";
import {
  getInquiry,
  getVisitorJourney,
  type VisitorJourney,
} from "@/lib/analytics/queries";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="mt-0.5 text-[14px] text-ink">{value ?? "-"}</dd>
    </div>
  );
}

function JourneyTimeline({ journey }: { journey: VisitorJourney }) {
  if (journey.sessions.length === 0) {
    return (
      <p className="text-[13px] leading-6 text-muted">
        연결된 방문 기록이 없습니다. (방문자가 쿠키/추적을 차단했거나, 추적 도입
        이전의 문의일 수 있습니다.)
      </p>
    );
  }
  return (
    <ol className="space-y-5">
      {journey.sessions.map((session) => {
        const items = [
          ...journey.pageviews
            .filter((pageview) => pageview.sessionId === session.id)
            .map((pageview) => ({
              at: pageview.enteredAt,
              kind: "pv" as const,
              text: pageview.path,
              detail: `${fmtDuration(pageview.durationMs / 1000)} 체류 · 스크롤 ${pageview.maxScrollPct}%`,
            })),
          ...journey.events
            .filter((event) => event.sessionId === session.id)
            .map((event) => ({
              at: event.createdAt,
              kind: "ev" as const,
              text: eventLabel(event.name),
              detail: event.label ?? "",
            })),
        ].sort((a, b) => a.at.localeCompare(b.at));

        return (
          <li key={session.id} className="rounded-lg border border-line p-4">
            <div className="flex flex-wrap items-center gap-2 text-[13px]">
              <span className="font-semibold text-ink">
                {session.visitNumber}회차 방문
              </span>
              <span className="text-muted">{fmtDateTime(session.startedAt)}</span>
              <ChannelBadge channel={session.channel} />
              {session.searchKeyword ? (
                <span className="text-muted">“{session.searchKeyword}”</span>
              ) : null}
              {session.channelDetail ? (
                <span className="text-[12px] text-muted">{session.channelDetail}</span>
              ) : null}
              <span className="text-muted">
                · {fmtDuration(session.durationSeconds)} ·{" "}
                {session.deviceType === "mobile" ? "모바일" : session.deviceType === "desktop" ? "데스크톱" : session.deviceType ?? "-"}
              </span>
              {session.hasInquiry ? (
                <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-ink">
                  문의한 세션
                </span>
              ) : null}
            </div>
            <ul className="mt-3 space-y-1.5 border-l-2 border-cream pl-4">
              {items.map((item, index) => (
                <li key={index} className="text-[13px]">
                  <span className="mr-2 text-[11px] text-muted">
                    {fmtDateTime(item.at).split(" ")[1] ?? ""}
                  </span>
                  {item.kind === "pv" ? (
                    <span className="font-medium text-ink">{item.text}</span>
                  ) : (
                    <span className="text-gold-text">⚡ {item.text}</span>
                  )}
                  {item.detail ? (
                    <span className="ml-2 text-[12px] text-muted">{item.detail}</span>
                  ) : null}
                </li>
              ))}
              {items.length === 0 ? (
                <li className="text-[12px] text-muted">기록된 페이지뷰가 없습니다.</li>
              ) : null}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

export default async function AdminInquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  const journey = inquiry.visitorId
    ? await getVisitorJourney(inquiry.visitorId)
    : { sessions: [], pageviews: [], events: [], topSections: [] };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/inquiries" className="text-[13px] text-muted hover:text-ink">
          ← 문의 목록
        </Link>
        <h1 className="text-[20px] font-bold text-ink">
          {inquiry.store}
          <span className="ml-2 text-[14px] font-normal text-muted">
            {fmtDateTime(inquiry.createdAt)} 접수
          </span>
        </h1>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="문의 내용">
          <dl className="space-y-3">
            <Field label="업장명" value={inquiry.store} />
            <Field label="지역" value={inquiry.region} />
            <Field
              label="연락처"
              value={
                inquiry.phone ? (
                  <a href={`tel:${inquiry.phone}`} className="font-medium text-gold-text">
                    {inquiry.phone}
                  </a>
                ) : (
                  "-"
                )
              }
            />
            <Field
              label="상담 내용"
              value={
                inquiry.message ? (
                  <span className="whitespace-pre-wrap">{inquiry.message}</span>
                ) : (
                  "-"
                )
              }
            />
            <Field
              label="메일 발송"
              value={inquiry.mailSent ? "발송됨" : <span className="text-[#e11d2e]">실패 — 직접 연락 필요</span>}
            />
          </dl>
        </SectionCard>

        <SectionCard
          title="유입 분석"
          description="측정 채널은 실제 유입 데이터, 자기보고는 고객이 폼에서 고른 값입니다."
        >
          <dl className="space-y-3">
            <Field
              label="채널 (측정 · 이번 방문)"
              value={<ChannelBadge channel={inquiry.channel} />}
            />
            <Field
              label="최초 유입 채널 (first-touch)"
              value={inquiry.firstChannel ? channelLabel(inquiry.firstChannel) : "-"}
            />
            <Field label="알게된 경로 (자기보고)" value={inquiry.selfSource} />
            <Field label="검색어" value={inquiry.searchKeyword} />
            <Field label="세부 유입처" value={inquiry.channelDetail} />
            <Field label="랜딩 페이지" value={inquiry.landingPath} />
            <Field
              label="리퍼러"
              value={
                inquiry.referrer ? (
                  <span className="break-all text-[12px]">{inquiry.referrer}</span>
                ) : (
                  "-"
                )
              }
            />
            {inquiry.utmSource ? (
              <Field
                label="UTM"
                value={`${inquiry.utmSource} / ${inquiry.utmMedium ?? "-"} / ${inquiry.utmCampaign ?? "-"}`}
              />
            ) : null}
            <Field
              label="방문 회차 · 기기"
              value={`${inquiry.visitNumber ? `${inquiry.visitNumber}회차` : "-"} · ${
                inquiry.deviceType === "mobile"
                  ? "모바일"
                  : inquiry.deviceType === "desktop"
                    ? "데스크톱"
                    : (inquiry.deviceType ?? "-")
              }`}
            />
          </dl>
        </SectionCard>

        <SectionCard title="영업 상태" description="상태와 메모는 저장 즉시 반영됩니다.">
          <form action={updateInquiry} className="space-y-3">
            <input type="hidden" name="id" value={inquiry.id} />
            <select
              name="status"
              defaultValue={inquiry.status}
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-[14px]"
            >
              {Object.entries(INQUIRY_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <textarea
              name="note"
              rows={5}
              defaultValue={inquiry.note ?? ""}
              placeholder="상담 메모"
              className="w-full resize-y rounded-md border border-line bg-white px-3 py-2 text-[14px]"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-ink py-2.5 text-[14px] font-medium text-white"
            >
              저장
            </button>
          </form>
        </SectionCard>
      </div>

      {journey.topSections.length > 0 ? (
        <SectionCard
          title="핵심 관심 콘텐츠"
          description="이 방문자가 실제 화면에서 오래 본 섹션 — 상담 전에 어떤 내용에 관심이 있었는지."
        >
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>페이지</th>
                  <th className={thClass}>섹션</th>
                  <th className={thClass}>본 시간</th>
                </tr>
              </thead>
              <tbody>
                {journey.topSections.slice(0, 8).map((section, index) => (
                  <tr key={index}>
                    <td className={tdClass}>{section.path}</td>
                    <td className={tdClass}>{section.section}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {fmtDuration(section.dwellMs / 1000)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard
        title="방문 여정"
        description="이 방문자의 전체 방문 기록 (최초 유입부터 문의까지)."
      >
        <JourneyTimeline journey={journey} />
      </SectionCard>
    </div>
  );
}
