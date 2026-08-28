import {
  BarList,
  PeriodSelector,
  SectionCard,
  parseDays,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { eventLabel, fmtDuration } from "@/lib/analytics/format";
import {
  getEventStats,
  getPageStats,
  getSectionStats,
} from "@/lib/analytics/queries";

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const days = parseDays((await searchParams).days);

  const [pages, sections, events] = await Promise.all([
    getPageStats(days),
    getSectionStats(days),
    getEventStats(days),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold text-ink">페이지 분석</h1>
        <PeriodSelector basePath="/admin/pages" days={days} />
      </div>

      <SectionCard
        title="페이지별 성과"
        description="종료율: 그 페이지가 세션의 마지막 화면이었던 비율 — 어느 화면에서 이탈하는지 보여줍니다. 스크롤: 평균 최대 스크롤 깊이."
      >
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>경로</th>
                <th className={thClass}>조회</th>
                <th className={thClass}>세션</th>
                <th className={thClass}>평균 체류</th>
                <th className={thClass}>스크롤</th>
                <th className={thClass}>랜딩</th>
                <th className={thClass}>종료</th>
                <th className={thClass}>종료율</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.path}>
                  <td className={`${tdClass} font-medium`}>{page.path}</td>
                  <td className={tdClass}>{page.views.toLocaleString()}</td>
                  <td className={tdClass}>{page.sessions.toLocaleString()}</td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {fmtDuration(page.avgSec)}
                  </td>
                  <td className={tdClass}>{page.avgScroll}%</td>
                  <td className={tdClass}>{page.entries.toLocaleString()}</td>
                  <td className={tdClass}>{page.exits.toLocaleString()}</td>
                  <td className={tdClass}>{page.exitRate}%</td>
                </tr>
              ))}
              {pages.length === 0 ? (
                <tr>
                  <td className={tdClass} colSpan={8}>
                    아직 데이터가 없습니다.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="섹션 관심도"
          description="화면에 실제로 보인 시간 기준 — 방문자가 어떤 내용에 오래 머무는지."
        >
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>페이지 · 섹션</th>
                  <th className={thClass}>본 횟수</th>
                  <th className={thClass}>평균</th>
                  <th className={thClass}>누적</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section, index) => (
                  <tr key={`${section.path}-${section.section}-${index}`}>
                    <td className={tdClass}>
                      <span className="text-[11px] text-muted">{section.path}</span>
                      <br />
                      {section.section}
                    </td>
                    <td className={tdClass}>{section.views.toLocaleString()}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {fmtDuration(section.avgSec)}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {fmtDuration(section.totalSec)}
                    </td>
                  </tr>
                ))}
                {sections.length === 0 ? (
                  <tr>
                    <td className={tdClass} colSpan={4}>
                      아직 데이터가 없습니다.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard
          title="행동(클릭) 이벤트"
          description="상담 CTA·전화·카카오 등 핵심 행동 횟수와 그 행동을 한 세션 수."
        >
          <BarList
            rows={events.map((event) => ({
              label: eventLabel(event.name),
              value: event.count,
              sub: `${event.sessions.toLocaleString()} 세션`,
            }))}
          />
        </SectionCard>
      </div>
    </div>
  );
}
