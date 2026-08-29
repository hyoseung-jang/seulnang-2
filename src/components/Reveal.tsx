// 스크롤 리빌 래퍼.
//
// 예전에는 요소마다 IntersectionObserver 를 하나씩 만드는 클라이언트 컴포넌트였다.
// 지금은 data-motion 속성만 찍는 서버 컴포넌트다 — 관찰은 부트 스크립트의
// 옵저버 하나가 전부 처리하므로 관찰자 수십 개와 그만큼의 JS 번들이 사라졌고,
// 하이드레이션 전에도 리빌이 동작한다.

type RevealVariant =
  | "rise" // 기본 — 아래에서 올라오며 페이드
  | "rise-sm" // 짧고 가벼운 이동(작은 요소)
  | "left" // 왼쪽에서
  | "right" // 오른쪽에서
  | "zoom" // 살짝 확대되며
  | "headline" // 헤드라인 — 아래를 잘라 두었다가 막이 오르듯
  | "stagger" // 직계 자식이 차례로
  | "stagger-x"; // 직계 자식이 옆에서 차례로

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** 등장 지연(ms) — 같은 화면 안에서 순서를 만들 때 */
  delay?: number;
  /** 등장 방식 */
  variant?: RevealVariant;
  /** stagger 계열에서 자식 간 간격(ms) */
  step?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  step,
}: RevealProps) {
  const style: React.CSSProperties & Record<string, string> = {};
  if (delay) style["--m-delay"] = `${delay}ms`;
  if (step) style["--m-child-step"] = `${step}ms`;

  return (
    <div
      data-motion={variant === "stagger-x" ? "stagger" : variant}
      data-motion-x={variant === "stagger-x" ? "" : undefined}
      className={className}
      style={style}
    >
      {children}
    </div>
  );
}
