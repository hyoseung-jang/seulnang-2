"use client";

import { useEffect, useState } from "react";

/* 슬낭 선대응 관제의 실제 응대 흐름을 그대로 시각화한 피드 (문구는 서비스 소개와 동일) */
const FEED = [
  { label: "움직임 감지", detail: "입구 센서 신호 수신", tone: "gold" },
  { label: "관제 요원 연결", detail: "호출 전 선대응 시작", tone: "green" },
  { label: "신분증 확인", detail: "미성년자 출입 차단", tone: "gold" },
  { label: "카드 키 발급", detail: "객실 안내 완료", tone: "green" },
  { label: "사장님 앱 알림", detail: "응대 내역 기록 완료", tone: "gold" },
] as const;

const VISIBLE = 3;

function FeedIcon({ tone }: { tone: "gold" | "green" }) {
  return (
    <span
      className={`mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full ${
        tone === "green"
          ? "bg-emerald-400/15 text-emerald-300"
          : "bg-gold/15 text-gold"
      }`}
      aria-hidden
    >
      <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
        {tone === "green" ? (
          <path
            d="m3.5 8.5 3 3 6-6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <>
            <circle cx="8" cy="8" r="2.2" fill="currentColor" />
            <path
              d="M3.2 3.6a6.4 6.4 0 0 0 0 8.8M12.8 3.6a6.4 6.4 0 0 1 0 8.8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </span>
  );
}

export function LiveMonitorCard() {
  const [head, setHead] = useState(VISIBLE);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const update = () =>
      setClock(
        new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    const kickoff = setTimeout(update, 0);
    const timer = setInterval(update, 1000);
    return () => {
      clearTimeout(kickoff);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(
      () => setHead((value) => (value + 1) % (FEED.length * VISIBLE * 4)),
      2800,
    );
    return () => clearInterval(timer);
  }, []);

  /* 최신 이벤트가 위로 쌓이는 최근 3건 */
  const items = Array.from({ length: VISIBLE }, (_, offset) => {
    const index = (head - offset + FEED.length * VISIBLE * 4) % FEED.length;
    return { ...FEED[index], key: head - offset };
  });

  return (
    <div className="relative w-full max-w-sm">
      <div
        className="gold-glow absolute -inset-5 rounded-[36px] bg-gold/25 blur-3xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-[24px] border border-white/12 bg-ink/75 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <p className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.02em] text-white">
            <span
              className="live-dot h-2 w-2 rounded-full bg-emerald-400"
              aria-hidden
            />
            실시간 선대응 관제
          </p>
          <p className="tnum text-[12px] text-white/45" suppressHydrationWarning>
            {clock || "--:--:--"}
          </p>
        </div>

        <ul className="space-y-1.5 px-4 py-4">
          {items.map((item, position) => (
            <li
              key={item.key}
              className={`feed-in flex items-start gap-3 rounded-2xl px-3 py-3 ${
                position === 0 ? "bg-white/[0.07]" : "opacity-60"
              }`}
            >
              <FeedIcon tone={item.tone} />
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-white">
                  {item.label}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-white/50">
                  {item.detail}
                </p>
              </div>
              {position === 0 ? (
                <span className="ml-auto mt-1 flex gap-1" aria-hidden>
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gold" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-white/10 bg-white/[0.03] px-5 py-3.5">
          <p className="text-[12px] text-white/50">슬낭 관제센터</p>
          <p className="text-[12px] font-medium text-gold">
            원하는 시간만, 시간 단위 관제
          </p>
        </div>
      </div>
      <p className="mt-3 text-center text-[12px] text-white/40">
        슬낭 선대응 관제 흐름
      </p>
    </div>
  );
}
