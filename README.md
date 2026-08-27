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
수신처는 `src/lib/site.ts` 의 `COMPANY.inquiryTo` 에 정의되어 있다.

| 변수 | 필수 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `SMTP_PASSWORD` | ✅ | - | 네이버웍스 SMTP 비밀번호. 없으면 폼이 안내 메시지를 반환하고 발송하지 않는다. |
| `SMTP_HOST` | | `smtp.worksmobile.com` | |
| `SMTP_PORT` | | `465` | 465는 SSL, 587은 STARTTLS로 동작한다. |
| `SMTP_USER` | | `biz@rosegoldsoftware.co.kr` | 발신 주소로도 쓰인다. 네이버웍스는 인증 계정과 다른 From 을 거부하므로 바꿀 때 주의. |

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
