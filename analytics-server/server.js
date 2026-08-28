// seulnang.co.kr 방문 분석용 MySQL HTTP 브리지.
//
// Vercel(서버리스)에서 이 서버의 MySQL 로 직접 붙을 수 없다 — NCP ACG 가
// 22/80/443 만 열고, DB 포트는 도커 네트워크 밖으로 공개하지 않는다(callstats 와
// 같은 원칙). 그래서 443(ota_nginx → /seulnang/) 뒤에서 SQL 을 대신 실행해 주는
// 얇은 브리지만 둔다. 쿼리 자체는 전부 웹사이트 리포(seulnang-2) 쪽 코드에 있다.
//
// 보안 경계: Bearer 토큰 + DB 계정이 seulnang_analytics 데이터베이스 하나에만
// 권한을 가진다. 토큰이 새면 이 DB 하나가 전부다 — OTA/콜스탯 DB 에는 못 간다.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const mysql = require("mysql2/promise");

const PORT = Number(process.env.PORT ?? 3000);
const API_TOKEN = process.env.API_TOKEN;
if (!API_TOKEN || API_TOKEN.length < 32) {
  console.error("[analytics] API_TOKEN 이 없거나 너무 짧습니다. 기동을 중단합니다.");
  process.exit(1);
}

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "seulnang_mysql",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "seulnang",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? "seulnang_analytics",
  charset: "utf8mb4",
  // DATETIME 을 문자열 그대로 주고받는다. 서버/커넥션 모두 +09:00 이라
  // 어디서 읽든 같은 KST 문자열이다.
  timezone: "+09:00",
  dateStrings: true,
  connectionLimit: 5,
  multipleStatements: false,
});

async function applySchema() {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  const statements = sql
    .split(/;\s*\n/)
    .map((s) =>
      // 문장 덩어리 안의 주석 "줄"만 걷어낸다. 덩어리 전체를 주석 시작 여부로
      // 거르면 주석이 앞에 붙은 CREATE 문이 통째로 사라진다.
      s
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter((s) => s.length > 0);
  for (const statement of statements) {
    await pool.query(statement);
  }
}

async function waitForDb() {
  // mysql 컨테이너 healthcheck 이후에도 계정 초기화가 늦을 수 있어 넉넉히 재시도.
  for (let i = 0; i < 60; i++) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("DB 에 연결하지 못했습니다.");
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error("body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function json(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      await pool.query("SELECT 1");
      return json(res, 200, { ok: true });
    }

    if (req.method !== "POST") return json(res, 404, { error: "not found" });

    const auth = req.headers.authorization ?? "";
    if (auth !== `Bearer ${API_TOKEN}`) {
      return json(res, 401, { error: "unauthorized" });
    }

    const raw = await readBody(req);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json(res, 400, { error: "invalid json" });
    }

    if (req.url === "/query") {
      const { sql, params } = body ?? {};
      if (typeof sql !== "string" || !Array.isArray(params ?? [])) {
        return json(res, 400, { error: "invalid query" });
      }
      const [rows] = await pool.query(sql, params ?? []);
      return json(res, 200, { rows });
    }

    if (req.url === "/batch") {
      // 여러 문장을 한 트랜잭션·한 왕복으로. Vercel↔한국 RTT 를 아끼는 게 목적.
      const { queries } = body ?? {};
      if (!Array.isArray(queries) || queries.length === 0 || queries.length > 50) {
        return json(res, 400, { error: "invalid batch" });
      }
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        const results = [];
        for (const q of queries) {
          if (typeof q?.sql !== "string") throw new Error("invalid batch item");
          const [rows] = await conn.query(q.sql, q.params ?? []);
          results.push(rows);
        }
        await conn.commit();
        return json(res, 200, { results });
      } catch (error) {
        await conn.rollback().catch(() => {});
        throw error;
      } finally {
        conn.release();
      }
    }

    return json(res, 404, { error: "not found" });
  } catch (error) {
    console.error("[analytics]", req.method, req.url, error.message);
    return json(res, 500, { error: "internal error" });
  }
});

waitForDb()
  .then(applySchema)
  .then(() => {
    server.listen(PORT, () => console.log(`[analytics] listening on :${PORT}`));
  })
  .catch((error) => {
    console.error("[analytics] 기동 실패:", error);
    process.exit(1);
  });

// docker stop 시 처리 중인 요청을 마치고 내려간다.
process.on("SIGTERM", () => {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
});
