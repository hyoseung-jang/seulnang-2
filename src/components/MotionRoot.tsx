"use client";

// 스크롤 리빌 런타임 — 사이트 전체에서 딱 하나만 마운트된다((site) 레이아웃).
//
// 동작 순서가 곧 설계다:
//  1) 서버 HTML 은 아무것도 숨기지 않은 채로 그려진다. JS 가 늦거나 죽어도,
//     크롤러가 읽어도 모든 문구가 그대로 보인다.
//  2) 하이드레이션 직후 이 컴포넌트가 html[data-motion-ready] 를 붙여 "무장"한다.
//     이때부터 [data-motion] 요소가 CSS 상 숨김 상태를 갖는다.
//  3) 같은 동기 블록 안에서 이미 화면에 걸쳐 있는 요소는 곧바로 data-motion-in
//     을 받는다. 브라우저는 이 태스크가 끝나야 페인트하므로 숨김 상태가 화면에
//     그려지는 일이 없다 — 첫 화면이 깜빡이지 않는다.
//  4) 나머지는 IntersectionObserver 하나가 맡는다. 요소마다 옵저버를 만들던
//     이전 방식과 달리 관찰자는 문서 전체에 하나뿐이다.
//
// 모든 DOM 변경이 하이드레이션 이후에만 일어나므로 서버/클라이언트 속성 불일치가
// 발생하지 않는다(인라인 스크립트로 미리 손대면 React 가 hydration mismatch 를 낸다).

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* IntersectionObserver 와 같은 기준: 요소 높이의 14% 이상이 보이고,
   화면 아래 6% 는 "아직 안 본 것"으로 친다. */
const RATIO = 0.14;
const BOTTOM_MARGIN = 0.06;

function alreadyInView(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return false;
  const bottom = window.innerHeight * (1 - BOTTOM_MARGIN);
  const visible = Math.min(rect.bottom, bottom) - Math.max(rect.top, 0);
  return visible > 0 && visible / rect.height >= RATIO;
}

let observer: IntersectionObserver | null = null;
const registered = new WeakSet<Element>();

function ensureObserver(): IntersectionObserver | null {
  if (observer) return observer;
  if (typeof IntersectionObserver === "undefined") return null;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.setAttribute("data-motion-in", "");
          // 반복 재생 대상(릴레이 등)만 계속 관찰한다. 화면 밖으로 나가면
          // data-motion-in 이 떨어져 무한 애니메이션이 완전히 멈춘다.
          if (!el.hasAttribute("data-motion-repeat")) observer?.unobserve(el);
        } else if (el.hasAttribute("data-motion-repeat")) {
          el.removeAttribute("data-motion-in");
        }
      }
    },
    { threshold: RATIO, rootMargin: `0px 0px -${BOTTOM_MARGIN * 100}% 0px` },
  );
  return observer;
}

function scan() {
  const root = document.documentElement;
  const nodes = Array.from(document.querySelectorAll("[data-motion]")).filter(
    (el) => !registered.has(el),
  );
  if (nodes.length === 0) return;

  const io = ensureObserver();
  if (!io) {
    // 옵저버를 못 쓰는 환경 — 연출을 포기하고 내용만 보이게 둔다.
    root.removeAttribute("data-motion-ready");
    return;
  }

  root.setAttribute("data-motion-ready", "");

  // 무장 직후 강제로 스타일을 계산시킨다. 숨김 상태가 "계산"은 되지만 이 태스크가
  // 끝나기 전이라 "그려지지"는 않는다. 덕분에 바로 아래에서 data-motion-in 을
  // 붙여도 트랜지션이 정상적으로 시작된다 — 첫 화면도 깜빡임 없이 등장한다.
  void document.body.offsetHeight;

  for (const el of nodes) {
    registered.add(el);
    if (alreadyInView(el)) {
      el.setAttribute("data-motion-in", "");
      if (el.hasAttribute("data-motion-repeat")) io.observe(el);
    } else {
      io.observe(el);
    }
  }
}

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    scan();
  }, [pathname]);

  return null;
}
