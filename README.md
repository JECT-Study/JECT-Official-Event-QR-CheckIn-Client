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

## 활성 행사 응답 계약

행사 정보 UI는 `GET /events/active`의 다음 응답을 사용합니다.
기존 `eventDateTime`은 시작 시간으로 유지하고, 종료 시간과 장소명·주소를 추가합니다.
날짜와 시간은 API가 제공하는 행사 현지 시각을 그대로 표시합니다.

```json
{
  "status": "SUCCESS",
  "data": {
    "name": "JECT 행사",
    "eventDateTime": "2026-10-10T14:00:00",
    "eventEndDateTime": "2026-10-10T18:00:00",
    "eventLocationName": "ICT CoC",
    "eventLocationAddress": "서울 마포구 마포대로 122 6층 ICT콤플렉스"
  },
  "timestamp": "2026-10-10T13:00:00"
}
```

`description`은 선택 항목이며 생략, `null`, 빈 문자열 또는 공백만 있는 문자열이면 설명과 전용 여백을 표시하지 않습니다. 내용이 있으면 체크인 폼 위에 표시합니다.

세 신규 필드는 필수입니다. 구버전 응답이나 유효하지 않은 행사 일정은 기존 조회 오류 흐름으로 처리됩니다.

## 구조

- `src/lib`: API 계약, 응답 분류, 검증과 경로 상수
- `src/hooks`: 활성 행사 조회 및 체크인 제출 상태
- `src/components`: 화면과 JDS 기반 UI
- `src/app`: 정적 라우트, 전역 스타일과 메타데이터

JDS 스타일은 `@jects/jds/styles`, 타이포그래피는 `@jects/jds/tokens`의 `textStyles`를 사용합니다.

## 행사 정보 화면 테스트

서버의 신규 응답 적용 전에는 `.env.development.local`에 다음 값을 설정하고 `pnpm dev`를 실행합니다.
이미 실행 중이라면 개발 서버를 재시작합니다.

```dotenv
NEXT_PUBLIC_MOCK_CHECKIN_EVENT=true
```

행사 조회 요청 대신 2026년 10월 10일 14:00~18:00, ICT CoC의 테스트 응답을 사용합니다.
화면 제목에 `(테스트)`가 표시되며, 실제 응답과 동일한 검증·변환 과정을 거칩니다.
이 설정은 개발 환경에서만 적용됩니다. 체크인 제출은 실제 API를 사용합니다.
서버 연동으로 돌아가려면 값을 `false`로 변경하고 개발 서버를 재시작합니다.
