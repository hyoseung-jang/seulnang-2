/* JSON-LD 직렬화 — 정적 상수만 다루지만 `<` 를 이스케이프해 스크립트 조기 종료를 원천 차단한다 */
export function jsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
