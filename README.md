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
