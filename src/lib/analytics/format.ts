// 대시보드 표기 헬퍼. DB 의 날짜는 이미 KST 문자열이다.

export function fmtDuration(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds));
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes < 60) return rest ? `${minutes}분 ${rest}초` : `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  return `${hours}시간 ${minutes % 60}분`;
}

/** "2026-08-28 14:03:22(.000)" → "8/28 14:03" */
export function fmtDateTime(kstString: string): string {
  const match = kstString.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (!match) return kstString;
  const [, , month, day, hour, minute] = match;
  return `${Number(month)}/${Number(day)} ${hour}:${minute}`;
}

/** "2026-08-28" → "8/28(금)" */
export function fmtDate(dateString: string): string {
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateString;
  const [, year, month, day] = match;
  const weekdayIndex = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  ).getUTCDay();
  const weekday = ["일", "월", "화", "수", "목", "금", "토"][weekdayIndex];
  return `${Number(month)}/${Number(day)}(${weekday})`;
}

export const INQUIRY_STATUS_LABELS: Record<string, string> = {
  new: "신규",
  contacted: "연락 완료",
  converted: "계약 전환",
  closed: "종료",
};

export const EVENT_LABELS: Record<string, string> = {
  contact_cta_click: "상담 CTA 클릭",
  phone_click: "전화 클릭",
  kakao_click: "카카오 문의 클릭",
  email_click: "이메일 클릭",
  outbound_click: "외부 링크 클릭",
  form_start: "문의폼 작성 시작",
  form_submit: "문의폼 제출 시도",
};

export function eventLabel(name: string): string {
  return EVENT_LABELS[name] ?? name;
}
