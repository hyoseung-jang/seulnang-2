/* 관제 릴레이 — "키오스크가 묻고, 관제가 답합니다" 를 눈으로 보이게 만든다.
 *
 * 이 섹션의 주장은 세 장치가 따로 노는 게 아니라 하나로 이어져 있다는 것이다.
 * 그런데 지금까지 그 주장은 세 칸짜리 정적인 표로만 놓여 있었다. 여기서는
 * 목록의 상단 경계선을 그대로 "신호선"으로 쓰고, 금빛 신호가 01 → 02 → 03 으로
 * 건너가게 한다. 신호가 지나가는 칸은 번호가 켜지고 옅은 금빛이 훑고 지나간다.
 * 읽지 않아도 인계(handoff)가 보이는 것이 목적이다.
 *
 * 텍스트·구조·시맨틱(ol/li)은 이전과 동일하다. 더해진 건 장식 레이어뿐이며
 * 전부 aria-hidden 이다.
 *
 * 재생 제어: data-motion-repeat 이 붙어 있어 화면 밖으로 나가면 data-motion-in
 * 이 떨어지고 모든 무한 애니메이션이 멈춘다(모바일 배터리). 다시 들어오면
 * 신호가 처음부터 다시 흐른다 — 스크롤을 되짚어 올라와도 메시지가 재생된다.
 */

type RelayStep = {
  no: string;
  title: string;
  body: string;
};

/* 신호가 각 칸의 중앙을 지나는 시각. relay-run 키프레임의 이동 곡선에서 역산했다.
   (칸 중앙 도달 = 사이클의 17% / 31% / 45%, --relay-dur 5.4s 기준) */
const WAKE_AT = ["0.75s", "1.5s", "2.25s"];

function LinkChevron() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
      <path
        d="m4 2.5 4 3.5-4 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HandoffRelay({ steps }: { steps: RelayStep[] }) {
  return (
    <div className="relay relative" data-motion="relay" data-motion-repeat="">
      {/* ── 신호선 + 신호 ────────────────────────────────────────────
          목록 상단 경계선 위에 겹쳐 놓는다. 12px 높이의 클리핑 상자 안에서
          움직이므로 빛이 목록 바깥으로 새지 않는다. */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-[6px] z-10 h-3 overflow-hidden"
        aria-hidden
      >
        <div className="relay-rail absolute inset-x-0 top-[6px] h-px bg-[linear-gradient(90deg,transparent,rgba(255,226,77,0.5)_18%,rgba(255,226,77,0.5)_82%,transparent)]" />
        <div className="relay-pulse absolute inset-y-0 left-0 w-[36%] bg-[radial-gradient(closest-side,rgba(255,226,77,0.95),rgba(255,226,77,0.28)_42%,transparent_76%)]" />
      </div>

      <ol className="grid divide-y divide-white/12 border-y border-white/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="relay-node relative py-6 sm:px-7 sm:first:pl-0 sm:last:pr-0"
            style={{ "--wake-at": WAKE_AT[index] } as React.CSSProperties}
          >
            {/* 신호가 지나가며 칸을 훑는 금빛 잔상 */}
            <span
              className="pointer-events-none absolute inset-0 overflow-hidden"
              aria-hidden
            >
              <span className="relay-wash absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,226,77,0.13)_45%,transparent)]" />
            </span>

            <p className="relay-num tnum relative text-[12px] font-bold text-gold">
              {step.no}
            </p>
            <h3 className="relative mt-2 text-[19px] font-bold">{step.title}</h3>
            <p className="relative mt-2 text-[14px] text-white/52">
              {step.body}
            </p>

            {/* 다음 단계로 넘긴다는 방향 표시 — 신호가 도착할 때 함께 밝아진다 */}
            {index < steps.length - 1 ? (
              <span
                className="relay-link absolute -bottom-[11px] left-1/2 z-10 grid h-[22px] w-[22px] -translate-x-1/2 rotate-90 place-items-center rounded-full bg-ink text-gold-bright sm:-right-[11px] sm:bottom-auto sm:left-auto sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:rotate-0"
                aria-hidden
              >
                <LinkChevron />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
