// 일별 추이 차트 (서버 렌더 SVG, 의존성 없음).
// 막대 = 세션 수(좌축), 선 = 문의 수(우축, 세션과 스케일이 크게 달라 분리).

import type { DailyPoint } from "@/lib/analytics/queries";
import { fmtDate } from "@/lib/analytics/format";

const WIDTH = 720;
const HEIGHT = 220;
const PAD_X = 8;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;

export function TrendChart({ points }: { points: DailyPoint[] }) {
  if (points.length === 0) {
    return <p className="text-[13px] text-muted">아직 데이터가 없습니다.</p>;
  }
  const maxSessions = Math.max(1, ...points.map((p) => p.sessions));
  const maxInquiries = Math.max(1, ...points.map((p) => p.inquiries));
  const innerWidth = WIDTH - PAD_X * 2;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const step = innerWidth / points.length;
  const barWidth = Math.min(28, step * 0.6);

  const barY = (value: number) => PAD_TOP + innerHeight * (1 - value / maxSessions);
  const lineY = (value: number) => PAD_TOP + innerHeight * (1 - value / maxInquiries);
  const centerX = (index: number) => PAD_X + step * index + step / 2;

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${centerX(i).toFixed(1)},${lineY(p.inquiries).toFixed(1)}`)
    .join(" ");

  // 라벨은 7개 안팎만 보여 준다.
  const labelEvery = Math.max(1, Math.ceil(points.length / 7));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="min-w-[560px]"
        role="img"
        aria-label="일별 세션·문의 추이"
      >
        {/* 기준선 */}
        {[0.5, 1].map((ratio) => (
          <line
            key={ratio}
            x1={PAD_X}
            x2={WIDTH - PAD_X}
            y1={PAD_TOP + innerHeight * (1 - ratio)}
            y2={PAD_TOP + innerHeight * (1 - ratio)}
            stroke="#e8e8e8"
            strokeDasharray="3 4"
          />
        ))}
        {/* 세션 막대 */}
        {points.map((p, i) => (
          <rect
            key={p.date}
            x={centerX(i) - barWidth / 2}
            y={barY(p.sessions)}
            width={barWidth}
            height={PAD_TOP + innerHeight - barY(p.sessions)}
            rx={3}
            fill="#ffe28a"
          >
            <title>{`${fmtDate(p.date)} 세션 ${p.sessions} · 문의 ${p.inquiries}`}</title>
          </rect>
        ))}
        {/* 문의 선 */}
        <path d={linePath} fill="none" stroke="#12122b" strokeWidth={2} />
        {points.map((p, i) =>
          p.inquiries > 0 ? (
            <circle
              key={`dot-${p.date}`}
              cx={centerX(i)}
              cy={lineY(p.inquiries)}
              r={3.5}
              fill="#12122b"
            >
              <title>{`${fmtDate(p.date)} 문의 ${p.inquiries}건`}</title>
            </circle>
          ) : null,
        )}
        {/* 날짜 라벨 */}
        {points.map((p, i) =>
          i % labelEvery === 0 ? (
            <text
              key={`label-${p.date}`}
              x={centerX(i)}
              y={HEIGHT - 8}
              textAnchor="middle"
              fontSize={11}
              fill="#454545"
            >
              {fmtDate(p.date)}
            </text>
          ) : null,
        )}
        {/* 최대값 표기 */}
        <text x={PAD_X} y={PAD_TOP - 4} fontSize={10} fill="#454545">
          세션 최대 {maxSessions.toLocaleString()} · 문의 최대 {maxInquiries.toLocaleString()}
        </text>
      </svg>
      <div className="mt-1 flex items-center gap-4 text-[12px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-gold" /> 세션
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-4 bg-ink" /> 문의
        </span>
      </div>
    </div>
  );
}
