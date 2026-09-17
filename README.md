# JECT 행사 체크인

JECT 오프라인 행사에서 QR로 접근해 이름과 휴대폰 번호를 제출하는 모바일 웹 클라이언트입니다. Next.js 정적 export로 빌드되며 런타임에는 브라우저에서 체크인 API를 직접 호출합니다.

## 개발 환경

- Node.js 22 이상
- pnpm 11

```bash
pnpm install
pnpm dev
```

로컬 개발 시 `NEXT_PUBLIC_CHECKIN_API_BASE_URL`을 지정하지 않으면 `/api` 요청을 `https://checkin-api.ject.kr`로 프록시합니다.

## 주요 명령어

```bash
pnpm lint
pnpm typecheck
pnpm check
pnpm security:audit
pnpm build
```

`pnpm build` 결과는 `out/`에 생성됩니다.

## 환경변수

```bash
NEXT_PUBLIC_CHECKIN_API_BASE_URL=https://checkin-api.ject.kr
```

운영 빌드는 개인정보가 다른 서버로 전송되지 않도록 `https://checkin-api.ject.kr` origin만 허용합니다.

## API 흐름

1. `/` 진입 시 `GET /events/active`로 활성 행사 정보를 조회합니다.
2. `EVENT-004` 응답이면 폼 대신 새로 고침 버튼을 표시합니다.
3. 폼 제출 시 `POST /events/active/check-in`으로 이름과 휴대폰 번호를 전송합니다.
4. 체크인 도메인 오류는 코드별로 완료 상태, 안내 다이얼로그 또는 정적 오류 페이지로 분기합니다.

```json
{
  "name": "김젝트",
  "phoneNumber": "01012345678"
}
```

주요 응답 처리:

- `CHECKIN-001`: 체크인 마감 다이얼로그
- `CHECKIN-002`: 이미 체크인 완료 상태
- `CHECKIN-003`~`CHECKIN-005`: 현장 문의 다이얼로그
- 그 밖의 제출 오류: `/error/checkin-failed`

## 구조

- `src/lib`: API 계약, 응답 분류, 검증과 경로 상수
- `src/hooks`: 활성 행사 조회 및 체크인 제출 상태
- `src/components`: 화면과 JDS 기반 UI
- `src/app`: 정적 라우트, 전역 스타일과 메타데이터

JDS 스타일은 `@jects/jds/styles`, 타이포그래피는 `@jects/jds/tokens`의 `textStyles`를 사용합니다.
