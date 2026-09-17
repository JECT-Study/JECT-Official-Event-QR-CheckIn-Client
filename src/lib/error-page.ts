export const ERROR_PAGE_CONTENT = {
  "checkin-failed": {
    title: "체크인을 실패했습니다.",
    description: "행사장 내 서포터즈에게 직접 체크인을 요청해주세요.",
  },
} as const;

export type ErrorPageContent =
  (typeof ERROR_PAGE_CONTENT)[keyof typeof ERROR_PAGE_CONTENT];
