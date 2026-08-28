import {
  BarList,
  ChannelBadge,
  PeriodSelector,
  SectionCard,
  parseDays,
  tableClass,
  tdClass,
  thClass,
} from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { channelLabel } from "@/lib/analytics/channel";
import { fmtDuration } from "@/lib/analytics/format";
import {
  getChannelStats,
  getDeviceStats,
  getReferrerDetails,
  getTopKeywords,
  getUtmCampaigns,
} from "@/lib/analytics/queries";

export default async function AdminChannelsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const days = parseDays((await searchParams).days);

  const [channels, keywords, details, campaigns, devices] = await Promise.all([
    getChannelStats(days),
    getTopKeywords(days),
    getReferrerDetails(days),
    getUtmCampaigns(days),
    getDeviceStats(days),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[20px] font-bold text-ink">채널 분석</h1>
        <PeriodSelector basePath="/admin/channels" days={days} />
      </div>

      <SectionCard
        title="채널별 성과"
        description="이탈률: 10초 미만 체류 + 1페이지 + 미문의 세션 비율. 전환율: 문의 세션 / 전체 세션."
      >
        <div className="overflow-x-auto">
          <table className={tableClass}>
            <thead>
              <tr>
                <th className={thClass}>채널</th>
                <th className={thClass}>세션</th>
                <th className={thClass}>방문자</th>
                <th className={thClass}>이탈률</th>
                <th className={thClass}>평균 체류</th>
                <th className={thClass}>평균 PV</th>
                <th className={thClass}>문의</th>
                <th className={thClass}>전환율</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((channel) => (
                <tr key={channel.channel}>
                  <td className={tdClass}>
                    <ChannelBadge channel={channel.channel} />
                  </td>
                  <td className={tdClass}>{channel.sessions.toLocaleString()}</td>
                  <td className={tdClass}>{channel.visitors.toLocaleString()}</td>
                  <td className={tdClass}>{channel.bounceRate}%</td>
                  <td className={`${tdClass} whitespace-nowrap`}>
                    {fmtDuration(channel.avgDurationSec)}
                  </td>
                  <td className={tdClass}>{channel.avgPageviews}</td>
                  <td className={tdClass}>
                    {channel.inquiries > 0 ? (
                      <span className="font-semibold text-gold-text">
                        {channel.inquiries}
                      </span>
                    ) : (
                      0
                    )}
                  </td>
                  <td className={tdClass}>{channel.conversionRate}%</td>
                </tr>
              ))}
              {channels.length === 0 ? (
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
          title="유입 검색어"
          description="리퍼러/광고 파라미터에서 수집된 검색어 (네이버는 대부분 전달되고, 구글 일반 검색은 전달되지 않습니다)."
        >
          <BarList
            rows={keywords.map((keyword) => ({
              label: `${keyword.keyword} · ${channelLabel(keyword.channel)}`,
              value: keyword.sessions,
              sub: keyword.inquiries > 0 ? `문의 ${keyword.inquiries}` : undefined,
            }))}
          />
        </SectionCard>

        <SectionCard
          title="세부 유입처"
          description="리퍼러 호스트·캠페인 등 채널의 세부 출처."
        >
          <BarList
            rows={details.map((detail) => ({
              label: `${detail.detail} · ${channelLabel(detail.channel)}`,
              value: detail.sessions,
              sub: detail.inquiries > 0 ? `문의 ${detail.inquiries}` : undefined,
            }))}
          />
        </SectionCard>

        <SectionCard
          title="UTM 캠페인"
          description="utm_source 가 붙은 유입만 집계됩니다. 광고 링크에 UTM 을 붙여야 여기서 성과가 보입니다."
        >
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>캠페인</th>
                  <th className={thClass}>소스/매체</th>
                  <th className={thClass}>세션</th>
                  <th className={thClass}>문의</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr key={`${campaign.campaign}-${index}`}>
                    <td className={tdClass}>{campaign.campaign}</td>
                    <td className={`${tdClass} whitespace-nowrap`}>
                      {campaign.source}/{campaign.medium}
                    </td>
                    <td className={tdClass}>{campaign.sessions.toLocaleString()}</td>
                    <td className={tdClass}>{campaign.inquiries}</td>
                  </tr>
                ))}
                {campaigns.length === 0 ? (
                  <tr>
                    <td className={tdClass} colSpan={4}>
                      UTM 이 붙은 유입이 아직 없습니다.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="기기 유형">
          <BarList
            rows={devices.map((device) => ({
              label:
                device.deviceType === "mobile"
                  ? "모바일"
                  : device.deviceType === "desktop"
                    ? "데스크톱"
                    : device.deviceType === "tablet"
                      ? "태블릿"
                      : device.deviceType,
              value: device.sessions,
              sub: device.inquiries > 0 ? `문의 ${device.inquiries}` : undefined,
            }))}
          />
        </SectionCard>
      </div>
    </div>
  );
}
