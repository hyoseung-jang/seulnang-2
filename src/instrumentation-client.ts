// 하이드레이션 전에 실행되는 클라이언트 계측 진입점 (Next.js 파일 컨벤션).
// 방문/전환 추적기(src/lib/tracker.ts)를 여기서 켠다.
import { initTracker, trackNavigation } from "@/lib/tracker";

initTracker();

// App Router 네비게이션(push/replace/back)마다 페이지뷰를 갈아 끼운다.
export function onRouterTransitionStart(url: string) {
  trackNavigation(url);
}
