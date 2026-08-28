# seulnang 방문 분석 백엔드 (ota-server)

seulnang.co.kr 의 방문/전환 추적 데이터를 저장하는 백엔드. **배포 위치는 이
리포(Vercel)가 아니라 ota-server(`~/.ssh/config` 의 `ota-server`)다.** 이
디렉터리는 서버의 `/root/seulnang-analytics/` 에 올라가는 파일의 원본 관리용이다.

## 구성

```
브라우저 ──/api/e──▶ Vercel(seulnang.co.kr)
                       │  Bearer 토큰
                       ▼
   https://api-ota.rosegoldsoftware.co.kr/seulnang/  (ota_nginx location)
                       │
                       ▼
   seulnang_analytics 컨테이너(server.js, SQL 브리지)
                       │  도커 네트워크 ota-backend_default 내부
                       ▼
   seulnang_mysql 컨테이너 (DB: seulnang_analytics, 포트 비공개)
```

- SQL 브리지 방식: 대시보드/수집 쿼리는 전부 웹사이트 코드
  (`src/lib/analytics/`)에 있고, 이 서버는 `/query`·`/batch` 로 대신 실행만 한다.
  스키마가 바뀌지 않는 한 이 서버는 재배포할 일이 없다.
- DB 계정(`seulnang`)은 `seulnang_analytics` 데이터베이스에만 권한이 있다.
- 시간은 전부 KST. MySQL `--default-time-zone=+09:00` + 브리지 `dateStrings`.

## 최초 배포 / 업데이트

```bash
# 리포 루트에서
rsync -a analytics-server/ ota-server:/root/seulnang-analytics/
ssh ota-server 'cd /root/seulnang-analytics && docker compose up -d --build'

# nginx location 반영(최초 1회, 이후 파일이 바뀌었을 때만)
scp analytics-server/nginx-location.conf ota-server:/root/ota-backend/nginx/conf.d/locations/seulnang.conf
ssh ota-server 'docker exec ota_nginx nginx -s reload'
```

`.env` 는 서버에만 있고 리포에 커밋하지 않는다:

```
DB_ROOT_PASSWORD=...   # openssl rand -hex 24
DB_PASSWORD=...        # openssl rand -hex 24
API_TOKEN=...          # openssl rand -hex 32 — Vercel 의 ANALYTICS_BRIDGE_TOKEN 과 같아야 한다
```

## 확인

```bash
curl https://api-ota.rosegoldsoftware.co.kr/seulnang/health
# {"ok":true}
```

## Vercel 쪽 환경 변수 (웹사이트)

| 변수 | 값 |
| --- | --- |
| `ANALYTICS_BRIDGE_URL` | `https://api-ota.rosegoldsoftware.co.kr/seulnang` |
| `ANALYTICS_BRIDGE_TOKEN` | 서버 `.env` 의 `API_TOKEN` |
| `ANALYTICS_IP_SALT` | 임의 문자열(IP 해시용) |
| `ADMIN_PASSWORD` | `/admin` 대시보드 로그인 비밀번호 |

이 변수들이 없으면 사이트는 추적만 조용히 건너뛰고 그 외 기능(문의 메일 등)은
그대로 동작한다.

## 스키마 변경

`schema.sql` 은 기동 때마다 실행되므로 멱등이어야 한다. 새 컬럼은
`CREATE TABLE IF NOT EXISTS` 로는 반영되지 않으니, 컬럼 추가는 서버에서
`ALTER TABLE` 을 직접 실행하고 `schema.sql` 의 CREATE 문도 함께 갱신한다.

```bash
ssh ota-server 'docker exec -i seulnang_mysql sh -c \
  "mysql -useulnang -p\"\$MYSQL_PASSWORD\" seulnang_analytics" <<< "ALTER TABLE ..."'
```
