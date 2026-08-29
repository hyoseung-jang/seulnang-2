"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  poster: string;
  src: string;
};

/* 히어로 배경 미디어 레이어.
   포스터(=영상 첫 프레임)를 즉시 그려 LCP 를 지키고, 영상은 페이지 로드가 끝난 뒤
   내려받아 재생이 시작되는 순간 페이드인한다. 루프 경계에서는 포스터로 잠깐
   크로스페이드해 12초 영상의 점프컷을 숨긴다.
   prefers-reduced-motion / 데이터 절약 모드에서는 영상을 아예 싣지 않는다. */
export function HeroVideo({ poster, src }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [atLoopEdge, setAtLoopEdge] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;

    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => setMounted(true), 300);
    };
    if (document.readyState === "complete") {
      start();
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration === 0)
      return;
    if (video.currentTime > video.duration - 0.55) setAtLoopEdge(true);
    else if (video.currentTime < 0.45) setAtLoopEdge(false);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <Image
        src={poster}
        alt=""
        fill
        preload
        className="object-cover object-[72%_center] md:object-center"
        sizes="100vw"
      />
      {mounted ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover object-[72%_center] transition-opacity duration-700 ease-out md:object-center ${
            playing && !atLoopEdge ? "opacity-100" : "opacity-0"
          }`}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={handleTimeUpdate}
          tabIndex={-1}
        />
      ) : null}
    </div>
  );
}
