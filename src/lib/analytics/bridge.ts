// ota-server 의 SQL 브리지 호출. 서버 코드 전용 — 클라이언트에서 import 금지
// (토큰이 번들로 새면 DB 가 통째로 노출된다).
//
// 환경 변수(ANALYTICS_BRIDGE_URL / ANALYTICS_BRIDGE_TOKEN)가 없으면
// analyticsEnabled=false 로 조용히 비활성화된다 — 추적이 죽어도 사이트 본 기능
// (문의 메일 등)은 영향받지 않아야 한다.

const BRIDGE_URL = process.env.ANALYTICS_BRIDGE_URL?.replace(/\/$/, "");
const BRIDGE_TOKEN = process.env.ANALYTICS_BRIDGE_TOKEN;

export const analyticsEnabled = Boolean(BRIDGE_URL && BRIDGE_TOKEN);

export type SqlQuery = { sql: string; params?: unknown[] };

async function call<T>(path: string, body: unknown, timeoutMs: number): Promise<T> {
  if (!analyticsEnabled) throw new Error("analytics bridge not configured");
  const res = await fetch(`${BRIDGE_URL}${path}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${BRIDGE_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    throw new Error(`analytics bridge ${path} -> ${res.status}`);
  }
  return (await res.json()) as T;
}

/** 단일 SELECT/DML. 대시보드 조회용. */
export async function q<T = Record<string, unknown>>(
  sql: string,
  params: unknown[] = [],
  timeoutMs = 10_000,
): Promise<T[]> {
  const { rows } = await call<{ rows: T[] }>("/query", { sql, params }, timeoutMs);
  return rows;
}

/** 여러 문장을 한 트랜잭션·한 왕복으로. 수집(ingest) 경로용. */
export async function batch(
  queries: SqlQuery[],
  timeoutMs = 8_000,
): Promise<unknown[]> {
  const { results } = await call<{ results: unknown[] }>("/batch", { queries }, timeoutMs);
  return results;
}
