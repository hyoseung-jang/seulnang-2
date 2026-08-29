"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Screen = {
  key: string;
  title: string;
  desc: string;
  src: string;
};

const AUTO_MS = 5000;

/* 실제 PMS 화면 쇼케이스.
   좌측 탭(모바일에선 상단 칩)을 고르면 우측 브라우저 프레임의 스크린샷이
   시그니처 이징으로 크로스페이드된다. 뷰포트에 들어오면 자동 순환을 시작하고,
   사용자가 직접 탭을 고르거나 포인터를 올리면 자동 순환을 멈춘다.
   prefers-reduced-motion 환경에서는 자동 순환 없이 수동 전환만 남긴다. */
export function PmsShowcase({ screens }: { screens: Screen[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false);
  const [cycle, setCycle] = useState(0); // 진행바 재시작 트리거
  const interactedRef = useRef(false);

  /* 뷰포트 진입 시 자동 순환 시작 */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.35 && !interactedRef.current) {
          setAuto(true);
        } else if (entry.intersectionRatio < 0.1) {
          setAuto(false);
        }
      },
      { threshold: [0, 0.1, 0.35] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!auto) return;
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % screens.length);
      setCycle((c) => c + 1);
    }, AUTO_MS);
    return () => window.clearInterval(timer);
  }, [auto, screens.length]);

  const select = useCallback((index: number) => {
    interactedRef.current = true;
    setAuto(false);
    setActive(index);
  }, []);

  return (
    <div
      ref={rootRef}
      className="grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-14"
    >
      {/* ── 탭 목록 ─────────────────────────────────────────── */}
      <div
        role="tablist"
        aria-label="PMS 화면 선택"
        className="flex snap-x gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2.5 lg:overflow-visible lg:pb-0"
      >
        {screens.map((screen, index) => {
          const on = index === active;
          return (
            <button
              key={screen.key}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`pms-panel-${screen.key}`}
              onClick={() => select(index)}
              className={`group relative shrink-0 snap-start overflow-hidden rounded-2xl border px-5 py-4 text-left transition-colors duration-500 lg:w-full lg:px-6 lg:py-5 ${
                on
                  ? "border-gold-deep/50 bg-white shadow-[0_16px_40px_rgba(199,149,0,0.12)]"
                  : "border-line bg-white/60 hover:border-ink/20"
              }`}
            >
              <span className="flex items-baseline gap-3">
                <span
                  className={`tnum text-[12px] font-bold transition-colors duration-500 ${
                    on ? "text-gold-text" : "text-muted/60"
                  }`}
                >
                  0{index + 1}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-[16px] font-bold tracking-[-0.01em] transition-colors duration-500 md:text-[17px] ${
                      on ? "text-ink" : "text-muted"
                    }`}
                  >
                    {screen.title}
                  </span>
                  <span
                    className={`mt-1 hidden text-[13px] leading-relaxed transition-colors duration-500 lg:block ${
                      on ? "text-muted" : "text-muted/70"
                    }`}
                  >
                    {screen.desc}
                  </span>
                </span>
              </span>
              {/* 자동 순환 진행바 — 활성 탭 하단에서 5초간 차오른다 */}
              <span
                key={on && auto ? cycle : -1}
                className={`pms-progress absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[linear-gradient(90deg,#ffbf00,#ffe24d)] ${
                  on && auto ? "pms-progress-run" : ""
                }`}
                style={{ opacity: on ? 1 : 0 }}
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {/* ── 브라우저 프레임 + 스크린샷 ──────────────────────── */}
      <div className="overflow-hidden rounded-[22px] border border-ink/10 bg-[#eceef2] shadow-[0_36px_90px_rgba(18,18,43,0.18)]">
        <div
          className="flex items-center gap-1.5 border-b border-black/5 bg-white/80 px-4 py-2.5"
          aria-hidden
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 hidden rounded-md bg-black/[0.05] px-3 py-1 text-[11px] font-medium text-muted sm:block">
            슬낭 PMS · {screens[active].title}
          </span>
        </div>
        <div className="relative aspect-[2000/1140]">
          {screens.map((screen, index) => (
            <div
              key={screen.key}
              id={`pms-panel-${screen.key}`}
              role="tabpanel"
              aria-hidden={index !== active}
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                index === active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={screen.src}
                alt={`슬낭 PMS ${screen.title} 실제 화면 — ${screen.desc}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 56vw, 100vw"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
