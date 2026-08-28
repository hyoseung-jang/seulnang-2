# 슬낭 홈페이지

Next.js + Tailwind CSS 기반 회사 홈페이지. 프로덕션은 Vercel에 배포되며 `seulnang.co.kr` 로 서비스한다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 환경 변수

문의폼은 네이버웍스 SMTP(`biz@rosegoldsoftware.co.kr`)로 메일을 발송한다.

| 변수 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `SMTP_PASSWORD` | ✅ | - | 네이버웍스 SMTP 비밀번호. 없으면 폼이 안내 메시지를 반환하고 발송하지 않는다. |
| `INQUIRY_TO` | | 아래 참고 | 문의 수신 주소. 쉼표로 구분한다. 비어 있거나 형식이 깨지면 `submit-inquiry.ts` 의 `DEFAULT_INQUIRY_TO` 로 발송한다. |
| `SMTP_HOST` | | `smtp.worksmobile.com` | |
| `SMTP_PORT` | | `465` | 465는 SSL, 587은 STARTTLS로 동작한다. |
| `SMTP_USER` | | `biz@rosegoldsoftware.co.kr` | 발신 주소로도 쓰인다. 네이버웍스는 인증 계정과 다른 From 을 거부하므로 바꿀 때 주의. |
| `ANALYTICS_BRIDGE_URL` | | - | 방문/전환 분석 저장소(ota-server 브리지). `https://api-ota.rosegoldsoftware.co.kr/seulnang`. 없으면 추적만 조용히 꺼진다. |
| `ANALYTICS_BRIDGE_TOKEN` | | - | 브리지 Bearer 토큰. ota-server `/root/seulnang-analytics/.env` 의 `API_TOKEN` 과 같아야 한다. |
| `ANALYTICS_IP_SALT` | | - | 방문자 IP 해시용 솔트(임의 문자열). |
| `ADMIN_PASSWORD` | | - | `/admin` 방문·문의 분석 대시보드 로그인 비밀번호. |

## 방문/전환 추적과 관리자 대시보드

- 추적기는 `src/instrumentation-client.ts` → `src/lib/tracker.ts`. 같은 도메인 `/api/e` 로
  sendBeacon 하고, Vercel 라우트가 ota-server 의 MySQL 브리지로 저장한다.
  백엔드 구성과 배포 방법은 [analytics-server/README.md](analytics-server/README.md) 참고.
- 채널 분류(네이버 검색/블로그/광고, 구글, 인스타그램 등)는 `src/lib/analytics/channel.ts`.
- 문의 전환은 `submit-inquiry.ts` 가 메일 성패와 무관하게 DB 에 기록한다.
- 대시보드는 `/admin` (개요·채널·페이지·문의). 비밀번호는 `ADMIN_PASSWORD`.

로컬에서는 `.env.local` 에 `SMTP_PASSWORD` 를 넣는다. macOS 키체인에 등록해 두었다면:

```bash
printf 'SMTP_PASSWORD=%s\n' "$(security find-generic-password -s naverworks-smtp -a biz@rosegoldsoftware.co.kr -w)" > .env.local
```

## 배포

`an2` 브랜치에 푸시하면 Vercel이 자동으로 프로덕션 배포한다. 수동 배포는:

```bash
npx vercel deploy --prod
```

Vercel 환경 변수는 `npx vercel env add SMTP_PASSWORD production --sensitive` 로 등록한다.
등록·변경 후에는 재배포해야 반영된다.

### 수신자 추가·제거

Vercel 대시보드 → Settings → Environment Variables 에서 `INQUIRY_TO` 를 고치고
재배포하면 된다. 코드 수정은 필요 없다.

수신 주소를 `src/lib/site.ts` 에 두면 안 된다. 그 파일은 `Header` 등 클라이언트
컴포넌트도 import 하므로, 적어 두는 순간 공개 JS 번들에 평문으로 노출되어
스팸 수집 대상이 된다. 반드시 `submit-inquiry.ts`("use server") 안에서만 다룬다.
