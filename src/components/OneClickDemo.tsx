"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { CtaButton } from "@/components/CtaButton";

type OneClickDemoProps = {
  poster: string;
  src: string;
  /* 좌측 카피 블록 — 서버에서 렌더된 children 을 그대로 받는다 */
  children: React.ReactNode;
};

/* 활성화 시 나타나는 상태 피드 — LiveMonitorCard 와 동일한 서비스 어휘만 사용 */
const STATUS_FEED = [
  { label: "관제 요원 연결", detail: "호출 전 선대응 시작" },
  { label: "움직임 감지 대기", detail: "입구 센서 실시간 감시" },
  { label: "사장님 앱 알림", detail: "응대 내역 기록 완료" },
] as const;

const KNOB = 56; // px — 트랙 안 노브 지름
const TRACK_PAD = 4;

export function OneClickDemo({ poster, src, children }: OneClickDemoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [active, setActive] = useState(false);
  const [maxX, setMaxX] = useState(0);
  const [dragX, setDragX] = useState<number | null>(null);
  const [warm, setWarm] = useState(false); // 뷰포트 근접 시 영상 프리로드
  const [videoOn, setVideoOn] = useState(false);
  const [ended, setEnded] = useState(false);

  const reducedRef = useRef(false);
  const interactedRef = useRef(false);
  const autoDemoRef = useRef(false);
  const dragStartRef = useRef<{ pointerX: number; baseX: number } | null>(null);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  /* 다른 탭에 다녀와도 무인 모드 영상이 멈춘 채 남지 않게 재개 */
  useEffect(() => {
    const resume = () => {
      const video = videoRef.current;
      if (!document.hidden && video && active && !ended && video.paused) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", resume);
    return () => document.removeEventListener("visibilitychange", resume);
  }, [active, ended]);

  /* 트랙 폭 측정 — 노브 이동 거리 계산 */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setMaxX(Math.max(0, track.clientWidth - KNOB - TRACK_PAD * 2));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setEnded(false);
    video.currentTime = 0;
    video
      .play()
      .then(() => setVideoOn(true))
      .catch(() => setVideoOn(false));
  }, []);

  const activate = useCallback(() => {
    setActive(true);
    playVideo();
  }, [playVideo]);

  const deactivate = useCallback(() => {
    setActive(false);
    setVideoOn(false);
    setEnded(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  const toggle = useCallback(() => {
    interactedRef.current = true;
    if (active) deactivate();
    else activate();
  }, [active, activate, deactivate]);

  /* 섹션 근접 시 영상 프리로드 — 슬라이드 즉시 재생을 위해 미리 받아둔다 */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWarm(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px 40% 0px" },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /* 슬라이더가 온전히 보인 뒤 2.2초간 미조작이면 스스로 시연한다.
     (관찰 대상은 트랙 — 긴 섹션 전체를 기준으로 하면 모바일에서 영영 안 뜬다) */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.intersectionRatio >= 0.9 &&
          !autoDemoRef.current &&
          !reducedRef.current
        ) {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            if (!interactedRef.current && !autoDemoRef.current) {
              autoDemoRef.current = true;
              activate();
            }
          }, 2200);
        } else if (entry.intersectionRatio < 0.9) {
          window.clearTimeout(timer);
        }
      },
      { threshold: [0, 0.9] },
    );
    observer.observe(track);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [activate]);

  /* 드래그 */
  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      interactedRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStartRef.current = {
        pointerX: event.clientX,
        baseX: active ? maxX : 0,
      };
      setDragX(active ? maxX : 0);
    },
    [active, maxX],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const start = dragStartRef.current;
      if (!start) return;
      const next = Math.min(
        maxX,
        Math.max(0, start.baseX + event.clientX - start.pointerX),
      );
      setDragX(next);
    },
    [maxX],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      const start = dragStartRef.current;
      dragStartRef.current = null;
      if (start === null) return;
      const moved = Math.abs(event.clientX - start.pointerX);
      setDragX(null);
      if (moved < 6) {
        /* 클릭 = 토글 */
        if (active) deactivate();
        else activate();
        return;
      }
      const landed = Math.min(
        maxX,
        Math.max(0, start.baseX + event.clientX - start.pointerX),
      );
      if (maxX > 0 && landed / maxX >= 0.5) {
        if (!active) activate();
      } else if (active) {
        deactivate();
      }
    },
    [active, activate, deactivate, maxX],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        toggle();
      } else if (event.key === "ArrowRight" && !active) {
        interactedRef.current = true;
        activate();
      } else if (event.key === "ArrowLeft" && active) {
        interactedRef.current = true;
        deactivate();
      }
    },
    [active, activate, deactivate, toggle],
  );

  const knobX = dragX ?? (active ? maxX : 0);
  const dragging = dragX !== null;
  const fillWidth = dragging
    ? knobX + KNOB + TRACK_PAD
    : active
      ? "100%"
      : 0;

  return (
    <div
      ref={rootRef}
      className="grid gap-9 md:grid-cols-[1fr_0.92fr] md:items-center md:gap-14"
    >
      {/* ── 좌: 카피 + 슬라이더 ─────────────────────────────── */}
      <div className="md:col-start-1 md:row-start-1">
        {children}

        <div className="mt-9 max-w-md">
          <div
            ref={trackRef}
            className={`relative h-16 select-none overflow-hidden rounded-full border transition-colors duration-500 ${
              active
                ? "border-gold-deep/60 bg-ink"
                : "border-ink/15 bg-ink shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
            }`}
          >
            {/* 채움 레이어 */}
            <div
              className={`absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#ffbf00,#ffe24d)] ${
                dragging ? "" : "transition-[width] duration-500 ease-out"
              }`}
              style={{ width: fillWidth }}
              aria-hidden
            />
            {/* 라벨 */}
            <p
              className={`pointer-events-none absolute inset-0 grid place-items-center text-[15px] font-bold tracking-[0.01em] transition-opacity duration-300 ${
                active || dragging ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="shimmer-label pl-8">밀어서 무인 프론트 시작</span>
            </p>
            <p
              className={`pointer-events-none absolute inset-0 flex items-center justify-center gap-2.5 pr-10 text-[15px] font-extrabold text-ink transition-opacity duration-300 ${
                active && !dragging ? "opacity-100" : "opacity-0"
              }`}
            >
              <span
                className="live-dot h-2 w-2 rounded-full bg-emerald-600"
                aria-hidden
              />
              무인 운영 중 · 슬낭이 지킵니다
            </p>
            {/* 노브 */}
            <button
              type="button"
              role="switch"
              aria-checked={active}
              aria-label="무인 운영 전환 스위치"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onKeyDown={handleKeyDown}
              className={`absolute top-1 left-1 grid h-14 w-14 cursor-grab touch-none place-items-center rounded-full bg-gold text-ink shadow-[0_6px_18px_rgba(0,0,0,0.35)] active:cursor-grabbing ${
                dragging ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              }`}
              style={{ transform: `translateX(${knobX}px)` }}
            >
              <span
                className={
                  active || dragging ? "" : "knob-nudge inline-flex"
                }
                aria-hidden
              >
                {active ? (
                  <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                    <path
                      d="m4.5 10.5 3.6 3.6 7.4-8.2"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 22 14" fill="none" className="h-4 w-6">
                    <path
                      d="M1 7h17M13 1.5 19.5 7 13 12.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
            </button>
          </div>
          <p className="mt-3 text-[13px] text-muted">
            지금 직접 밀어보세요. 실제 사장님 앱과 같은 방식입니다.
          </p>
        </div>
      </div>

      {/* ── 우: 반응하는 스토리 영상 ────────────────────────── */}
      <div className="md:col-start-2 md:row-start-1 md:row-span-2">
        <div className="relative mx-auto w-full max-w-[400px]">
          <div
            className={`absolute -inset-4 rounded-[36px] bg-gold/30 blur-2xl transition-opacity duration-700 ${
              active ? "gold-glow opacity-100" : "opacity-0"
            }`}
            aria-hidden
          />
          <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] border border-ink/10 bg-night shadow-[0_30px_80px_rgba(18,18,43,0.35)]">
            <Image
              src={poster}
              alt="원클릭 무인 전환 뒤 안심하고 호텔을 나서는 사장님"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 400px, 90vw"
            />
            {warm ? (
              <video
                ref={videoRef}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  videoOn ? "opacity-100" : "opacity-0"
                }`}
                src={src}
                muted
                playsInline
                preload="auto"
                onEnded={() => setEnded(true)}
                aria-label="원클릭 무인 전환 후 사장님이 퇴근하는 스토리 영상"
              />
            ) : null}

            {/* 상단 상태 뱃지 */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <p
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-bold backdrop-blur transition-colors duration-500 ${
                  active
                    ? "bg-gold text-ink"
                    : "bg-black/45 text-white/85 ring-1 ring-white/20"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "live-dot bg-emerald-600" : "bg-white/60"
                  }`}
                  aria-hidden
                />
                {active ? "무인 운영 중" : "직접 운영 중"}
              </p>
              {ended ? (
                <button
                  type="button"
                  onClick={playVideo}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[12px] font-semibold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-black/65"
                >
                  <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3" aria-hidden>
                    <path
                      d="M12 7A5 5 0 1 1 7 2h2.5M9.5 2 11 .5M9.5 2 11 3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  다시 보기
                </button>
              ) : null}
            </div>

            {/* 하단 캡션 */}
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(6,6,20,0.88),transparent)] px-5 pb-5 pt-14">
              <p className="text-[14px] font-semibold leading-relaxed text-white/90">
                {active
                  ? "프론트는 슬낭이 지키고, 사장님은 퇴근합니다."
                  : "슬라이더를 밀면, 사장님의 밤이 바뀝니다."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 좌 하단: 활성화 시 상태 피드 + CTA ──────────────── */}
      <div className="md:col-start-1 md:row-start-2">
        <div
          className="grow-panel"
          data-open={active}
          aria-live="polite"
        >
          <div>
            <ul className="max-w-md space-y-2">
              {STATUS_FEED.map((item, index) => (
                <li
                  key={item.label}
                  className={`flex items-center gap-3.5 rounded-2xl border border-ink/8 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(18,18,43,0.06)] ${
                    active ? "feed-in" : ""
                  }`}
                  style={{ animationDelay: `${200 + index * 240}ms` }}
                >
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/20 text-gold-text"
                    aria-hidden
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4">
                      <path
                        d="m3.5 8.5 3 3 6-6.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold">{item.label}</p>
                    <p className="text-[12px] text-muted">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4 pb-1">
              <CtaButton>우리 업장도 원클릭 상담</CtaButton>
              <p className="text-[13px] text-muted">
                방금 그 편함, 도입 상담은 무료입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
