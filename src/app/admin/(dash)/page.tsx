import Link from "next/link";
import { TrendChart } from "@/components/admin/TrendChart";
import {
  BarList,
  ChannelBadge,
  PeriodSelector,
  SectionCard,
  StatCard,
  parseDays,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { analyticsEnabled } from "@/lib/analytics/bridge";
import { channelLabel } from "@/lib/analytics/channel";
import { fmtDateTime, fmtDuration } from "@/lib/analytics/format";
import {
  getChannelStats,
  getDailySeries,
  getOverview,
  getRecentSessions,
} from "@/lib/analytics/queries";

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const days = parseDays((await searchParams).days);

  if (!analyticsEnabled) {
    return (
      <div className="rounded-xl border border-line bg-white p-8">
        <p className="text-[15px] font-semibold text-ink">
          분석 서버 연결이 설정되지 않았습니다.
        </p>
        <p className="mt-2 text-[13px] leading-6 text-muted">
          Vercel 환경 변수 <code>ANALYTICS_BRIDGE_URL</code> 과{" "}
          <code>ANALYTICS_BRIDGE_TOKEN</code> 을 설정해 주세요. 자세한 내용은
          리포의 <code>analytics-server/README.md</code> 를 참고하세요.
        </p>
      </div>
    );
  }

  const [overview, daily, channels, recent] = await Promise.all([
    getOverview(days),
    getDailySeries(days),
    getChannelStats(days),
    getRecentSessions(15),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold text-ink">개요</h1>
        <PeriodSelector basePath="/admin" days={days} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          label="방문자"
          value={overview.visitors.toLocaleString()}
          sub={`신규 ${overview.newVisitors.toLocaleString()}명`}
        />
        <StatCard
          label="세션"
          value={overview.sessions.toLocaleString()}
          sub={`페이지뷰 ${overview.pageviews.toLocaleString()}`}
        />
        <StatCard
          label="문의"
          value={`${overview.inquiries.toLocaleString()}건`}
          sub={
            overview.mailFailed > 0
              ? `메일 실패 ${overview.mailFailed}건 포함`
              : `전환율 ${overview.conversionRate}%`
          }
        />
        <StatCard
          label="이탈률"
          value={`${overview.bounceRate}%`}
          sub={`평균 체류 ${fmtDuration(overview.avgDurationSec)}`}
        />
      </div>

      <SectionCard title="일별 추이" description="막대: 세션 · 선: 문의">
        <TrendChart points={daily} />
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard
          title="채널별 세션"
          description="이번 기간 유입 채널 상위. 자세한 내용은 채널 탭에서."
        >
          <BarList
            rows={channels.slice(0, 8).map((channel) => ({
              label: channelLabel(channel.channel),
              value: channel.sessions,
              sub: channel.inquiries > 0 ? `문의 ${channel.inquiries}` : undefined,
            }))}
          />
          <Link
            href={`/admin/channels?days=${days}`}
            className="mt-3 inline-block text-[13px] font-medium text-gold-text hover:underline"
          >
            채널 분석 자세히 →
          </Link>
        </SectionCard>

        <SectionCard title="최근 세션" description="실시간에 가까운 최근 방문 15건.">
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>시각</th>
                  <th className={thClass}>채널</th>
                  <th className={thClass}>랜딩</th>
                  <th className={thClass}>PV</th>
                  <th className={thClass}>체류</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((session) => (
                  <tr key={session.id} className={session.hasInquiry ? "bg-gold/20" : undefined}>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {fmtDateTime(session.startedAt)}
                    </td>
                    <td className={tdClass}>
                      <ChannelBadge channel={session.channel} />
                      {session.searchKeyword ? (
                        <span className="ml-1 text-[12px] text-muted">
                          “{session.searchKeyword}”
                        </span>
                      ) : null}
                      {session.hasInquiry ? (
                        <span className="ml-1 text-[12px] font-semibold text-gold-text">
                          문의
                        </span>
                      ) : null}
                    </td>
                    <td className={`${tdClass} max-w-[120px] truncate`}>
                      {session.landingPath ?? "-"}
                    </td>
                    <td className={tdClass}>{session.pageviewCount}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {fmtDuration(session.durationSeconds)}
                    </td>
                  </tr>
                ))}
                {recent.length === 0 ? (
                  <tr>
                    <td className={tdClass} colSpan={5}>
                      아직 데이터가 없습니다.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
