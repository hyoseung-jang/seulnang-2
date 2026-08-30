"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/* 스크롤 시퀀스 — 스크롤 위치가 곧 재생 헤드다.
   힉스필드로 제작한 마스터 영상을 프레임 연속으로 잘라 두고, 핀 고정된
   뷰포트의 캔버스에 스크롤 진행도에 해당하는 프레임을 그린다. 카메라는
   사용자가 미는 만큼만 움직이므로 "작아지는 키오스크", "밝아오는 새벽" 같은
   공간·시간의 변화를 사용자의 손으로 직접 겪게 한다.

   안전 계약은 리빌 시스템과 같다:
   - 서버 HTML 은 포스터 + 모든 캡션을 일반 흐름으로 그대로 보여 준다.
     JS 가 죽거나 크롤러가 읽어도 문구가 사라질 수 없다.
   - 하이드레이션 뒤 이 컴포넌트가 루트에 data-seq-on 을 붙여야만(무장)
     트랙이 길어지고 뷰가 핀 고정되며 캡션이 진행도 연동 오버레이가 된다.
   - prefers-reduced-motion / 데이터 절약 모드에서는 무장하지 않는다 —
     정적 레이아웃이 곧 최종 상태다.
   - 프레임을 한 장도 못 읽으면(예: AVIF 미지원 구형 브라우저) 스스로 무장을
     풀고 정적 레이아웃으로 돌아간다. 빈 화면을 260vh 스크롤하게 두지 않는다.

   프레임은 섹션이 1.5 화면 안으로 다가와야 내려받기 시작하고, 성긴 것부터
   촘촘한 순서(8→4→2→1 스트라이드)로 채워 스크럽 중 가장 가까운 프레임을
   그린다 — 로딩이 덜 끝나도 시퀀스가 끊기지 않는다. */

const CONCURRENCY = 6;

export type SeqVariant = {
  /** base 아래 폴더명 */
  dir: string;
  /** 이 렌디션 프레임의 실제 픽셀 크기 */
  w: number;
  h: number;
  ext: "avif" | "webp";
};

type ScrollSequenceProps = {
  /** 프레임 폴더 경로 — `${base}/${변형폴더}/NNN.${확장자}` 구조여야 한다 */
  base: string;
  frameCount: number;
  /** 같은 컷의 렌디션 목록 — 클라이언트는 이 중 하나만 내려받는다 */
  variants: readonly SeqVariant[];
  /** 시퀀스 첫 프레임과 동일한 포스터(무장 전·로딩 전 표시) */
  poster: string;
  posterAlt: string;
  /** 핀 구간의 스크롤 길이(vh) — 길수록 천천히 스크럽된다 */
  lengthVh?: number;
  className?: string;
  /** SeqCaption 요소들 */
  children: React.ReactNode;
};

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

/* 채워야 할 화면(디바이스 픽셀)에 가장 알맞은 렌디션 하나를 고른다.

   tall 처럼 마스터를 세로로 잘라 둔 렌디션은 제 비율보다 가로로 넓은
   뷰포트에 쓰면 cover 가 위아래를 잘라 원본 구도가 깨진다. 그래서 후보는
   "뷰포트보다 넓거나 같은 비율"만 본다 — 그 안에서는 cover 가 좌우만
   자르므로 마스터를 그대로 쓴 것과 화면이 정확히 같다.

   그 안에서는 "필요한 만큼만, 그 이상은 받지 않는다"로 고른다. 화면을 확대
   없이 채울 수 있는 것이 있으면 그중 가장 가벼운 것 — 더 큰 걸 받아 봐야
   화면에 보이지 않는 픽셀이다. 아무것도 못 채우는 화면(대개 세로 휴대폰)
   에서는 가장 덜 늘어나는 것을 쓰되, 늘어나는 정도가 같으면 가벼운 쪽이다.
   tall 은 wide 와 높이가 같아 세로 화면에서 선명도가 동일하므로 이 규칙에서
   언제나 이긴다 — 같은 화질을 절반 용량으로 받는 셈이다. */
function pickVariant(
  variants: readonly SeqVariant[],
  vw: number,
  vh: number,
): SeqVariant {
  const ratio = vw / Math.max(vh, 1);
  const fits = variants.filter((v) => v.w / v.h >= ratio - 0.001);
  const pool = fits.length > 0 ? fits : variants;
  const upscale = (v: SeqVariant) => Math.max(vw / v.w, vh / v.h);
  const area = (v: SeqVariant) => v.w * v.h;

  const enough = pool.filter((v) => upscale(v) <= 1.001);
  if (enough.length > 0) {
    return enough.reduce((best, v) => (area(v) < area(best) ? v : best));
  }
  return pool.reduce((best, v) => {
    const d = upscale(v) - upscale(best);
    if (d < -0.001) return v;
    if (d > 0.001) return best;
    return area(v) < area(best) ? v : best;
  });
}

export function ScrollSequence({
  base,
  frameCount,
  variants,
  poster,
  posterAlt,
  lengthVh = 240,
  className,
  children,
}: ScrollSequenceProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!root || !track || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    root.setAttribute("data-seq-on", "");

    const captions = Array.from(
      root.querySelectorAll<HTMLElement>("[data-seq-from]"),
    ).map((el) => ({
      el,
      from: Number.parseFloat(el.dataset.seqFrom ?? "0"),
      to: Number.parseFloat(el.dataset.seqTo ?? "1"),
    }));

    /* ── 렌디션 선택 ──────────────────────────────────────────────── */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const demand = () => {
      const view = canvas.parentElement;
      const vw = (view?.clientWidth || window.innerWidth) * dpr;
      const vh = (view?.clientHeight || window.innerHeight) * dpr;
      return [vw, vh] as const;
    };

    let variant = pickVariant(variants, ...demand());

    /* ── 프레임 로딩: 성긴 스트라이드부터, 동시 6개 ─────────────── */
    const order: number[] = [];
    const queued = new Set<number>();
    for (const stride of [8, 4, 2, 1]) {
      for (let i = 0; i < frameCount; i += stride) {
        if (!queued.has(i)) {
          queued.add(i);
          order.push(i);
        }
      }
    }

    /* 렌디션이 바뀌면(기기 회전 등) 이전 요청의 onload 가 새 배열을 더럽히지
       않도록 세대 번호로 끊는다 */
    let generation = 0;
    let frames: (HTMLImageElement | null)[] = Array.from(
      { length: frameCount },
      () => null,
    );
    let cursor = 0;
    let inFlight = 0;
    let loading = false;
    let loaded = 0;
    let failed = 0;

    const pump = () => {
      const gen = generation;
      const { dir, ext } = variant;
      while (inFlight < CONCURRENCY && cursor < order.length) {
        const idx = order[cursor];
        cursor += 1;
        inFlight += 1;
        const img = new window.Image();
        img.onload = () => {
          if (gen !== generation) return;
          frames[idx] = img;
          loaded += 1;
          inFlight -= 1;
          paint();
          pump();
        };
        img.onerror = () => {
          if (gen !== generation) return;
          failed += 1;
          inFlight -= 1;
          /* 이 포맷을 아예 못 읽는 브라우저면 정적 레이아웃으로 돌려준다 */
          if (loaded === 0 && failed >= 4) {
            disarm();
            return;
          }
          pump();
        };
        img.src = `${base}/${dir}/${String(idx + 1).padStart(3, "0")}.${ext}`;
      }
    };
    const startLoading = () => {
      if (loading) return;
      loading = true;
      pump();
    };

    /* ── 진행도 계산과 스크럽 ────────────────────────────────────── */
    let target = 0;
    let current = 0;
    let painted = -1;
    let raf = 0;
    let running = false;
    let lastTime = 0;
    let nearViewport = false;

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      target = span > 0 ? clamp01(-rect.top / span) : 0;
    };

    const resizeCanvas = () => {
      const view = canvas.parentElement;
      if (!view) return;
      const vw = view.clientWidth;
      const vh = view.clientHeight;
      /* 백킹 해상도는 원본 프레임이 실제로 채울 수 있는 만큼까지만 올린다.
         그 위로는 캔버스에서 늘리나 CSS 로 늘리나 화질이 같고 메모리만 먹는다. */
      const fit = Math.min(
        variant.w / Math.max(vw, 1),
        variant.h / Math.max(vh, 1),
      );
      const scale = Math.min(dpr, Math.max(1, fit));
      canvas.width = Math.max(1, Math.round(vw * scale));
      canvas.height = Math.max(1, Math.round(vh * scale));
      painted = -1;
    };

    /* 렌디션 교체 — 받아 둔 프레임을 버리고 새 폴더로 다시 채운다.
       캔버스에 그려진 마지막 그림은 지우지 않으므로 화면이 비지 않는다. */
    const swapVariant = (next: SeqVariant) => {
      variant = next;
      generation += 1;
      frames = Array.from({ length: frameCount }, () => null);
      cursor = 0;
      inFlight = 0;
      loaded = 0;
      failed = 0;
      loading = false;
      resizeCanvas();
      if (nearViewport) startLoading();
    };

    const nearestLoaded = (idx: number): number => {
      if (frames[idx]) return idx;
      for (let d = 1; d < frameCount; d += 1) {
        if (idx - d >= 0 && frames[idx - d]) return idx - d;
        if (idx + d < frameCount && frames[idx + d]) return idx + d;
      }
      return -1;
    };

    const paint = () => {
      const idx = nearestLoaded(Math.round(current * (frameCount - 1)));
      if (idx < 0 || idx === painted) return;
      const img = frames[idx];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const cover = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * cover;
      const dh = img.height * cover;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      painted = idx;
      canvas.setAttribute("data-seq-painted", "");
    };

    const updateCaptions = () => {
      /* 스크럽에 직결되는 연출(.seq-line2 등)이 진행도를 CSS 로 읽는다 */
      root.style.setProperty("--seq-p", current.toFixed(4));
      for (const cap of captions) {
        const active = current >= cap.from && current <= cap.to;
        if (active) cap.el.setAttribute("data-seq-active", "");
        else cap.el.removeAttribute("data-seq-active");
        /* 지나간 캡션은 위로 빠진다 — 스크롤 방향과 같은 쪽으로 사라져야
           카메라와 캡션이 한 무대에 있는 것처럼 느껴진다 */
        if (current > cap.to) cap.el.setAttribute("data-seq-past", "");
        else cap.el.removeAttribute("data-seq-past");
      }
    };

    const tick = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      /* 시간 기반 감쇠 — 프레임레이트와 무관하게 같은 손맛을 낸다 */
      current += (target - current) * (1 - Math.pow(0.002, dt));
      if (Math.abs(target - current) < 0.0004) current = target;
      paint();
      updateCaptions();
      if (!nearViewport && current === target) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (running) return;
      running = true;
      lastTime = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measure();
      if (nearViewport) wake();
    };
    const onResize = () => {
      /* 회전·창 크기 변경으로 알맞은 렌디션이 달라졌으면 갈아 끼운다 */
      const next = pickVariant(variants, ...demand());
      if (next !== variant) swapVariant(next);
      else resizeCanvas();
      measure();
      paint();
      if (nearViewport) wake();
    };

    /* 다가오면 로딩을 시작하고, 화면 근처에 있는 동안만 rAF 를 돌린다 */
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          nearViewport = entry.isIntersecting;
          if (entry.isIntersecting) {
            startLoading();
            measure();
            wake();
          }
        }
      },
      { rootMargin: "150% 0px 150% 0px" },
    );

    /* 무장 해제 — 포스터 + 일반 흐름 캡션이 다시 최종 상태가 된다 */
    const disarm = () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      running = false;
      nearViewport = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      root.removeAttribute("data-seq-on");
      root.style.removeProperty("--seq-p");
      for (const cap of captions) {
        cap.el.removeAttribute("data-seq-active");
        cap.el.removeAttribute("data-seq-past");
      }
    };

    io.observe(track);

    resizeCanvas();
    measure();
    current = target;
    updateCaptions();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [base, frameCount, variants]);

  return (
    <div
      ref={rootRef}
      className={`seq ${className ?? ""}`}
      style={{ "--seq-len": lengthVh } as React.CSSProperties}
    >
      <div ref={trackRef} className="seq-track">
        <div className="seq-view">
          <div className="seq-media">
            <Image
              src={poster}
              alt={posterAlt}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <canvas
              ref={canvasRef}
              className="seq-canvas absolute inset-0 h-full w-full"
              aria-hidden
            />
            <div className="seq-shade" aria-hidden />
          </div>
          <div className="seq-caps">{children}</div>
        </div>
      </div>
    </div>
  );
}

type SeqCaptionAlign = "bl" | "tl" | "center" | "bc";

type SeqCaptionProps = {
  /** 이 캡션이 보이는 진행도 구간 [from, to] — 0~1 */
  from: number;
  to: number;
  align?: SeqCaptionAlign;
  className?: string;
  children: React.ReactNode;
};

/* 시퀀스 캡션 — 무장 전에는 일반 문단으로 쌓이고,
   무장 후에는 진행도 구간에서만 나타나는 오버레이가 된다. */
export function SeqCaption({
  from,
  to,
  align = "bl",
  className,
  children,
}: SeqCaptionProps) {
  return (
    <div
      data-seq-from={from}
      data-seq-to={to}
      data-seq-align={align}
      className={`seq-cap ${className ?? ""}`}
    >
      <div className="seq-cap-inner">{children}</div>
    </div>
  );
}
