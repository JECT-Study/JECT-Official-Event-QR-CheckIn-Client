export const ERROR_PAGE_CONTENT = {
  "invalid-access": {
    title: "유효하지 않은 QR 코드입니다",
    description: "현장에 게시된 QR 코드를 다시 확인해주세요.",
  },
  "checkin-failed": {
    title: "체크인을 실패했습니다.",
    description: "행사장 내 서포터즈에게 직접 체크인을 요청해주세요.",
  },
} as const;

export type ErrorPageContent =
  (typeof ERROR_PAGE_CONTENT)[keyof typeof ERROR_PAGE_CONTENT];
