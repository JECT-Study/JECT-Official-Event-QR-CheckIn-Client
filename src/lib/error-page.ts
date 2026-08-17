export const ERROR_PAGE_CONTENT = {
  "invalid-access": {
    title: "유효하지 않은 접근입니다.",
    description: "URL 또는 QR 코드를 다시 확인해주세요.",
  },
  "checkin-failed": {
    title: "체크인에 실패했습니다.",
    description: "잠시 후 다시 시도해주세요.",
  },
} as const;

export type ErrorPageType = keyof typeof ERROR_PAGE_CONTENT;
export type ErrorPageContent = (typeof ERROR_PAGE_CONTENT)[ErrorPageType];

export function isErrorPageType(value: string): value is ErrorPageType {
  return value in ERROR_PAGE_CONTENT;
}
