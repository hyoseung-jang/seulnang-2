"use client";

// 대시보드 조회 실패(브리지 다운 등) 시의 에러 표면.
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-xl border border-line bg-white p-8 text-center">
      <p className="text-[15px] font-semibold text-ink">
        데이터를 불러오지 못했습니다.
      </p>
      <p className="mt-1 text-[13px] text-muted">
        분석 서버(ota-server)가 응답하지 않거나 환경 변수가 잘못됐을 수 있습니다.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-md bg-ink px-4 py-2 text-[13px] font-medium text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
