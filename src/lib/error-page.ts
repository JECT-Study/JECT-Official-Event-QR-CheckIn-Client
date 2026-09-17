export type ErrorPageContent = {
  title?: string;
  description: string;
};

export const ERROR_PAGE_CONTENT = {
  "invalid-access": {
    description: "유효하지 않는 접근입니다.",
  },
  "checkin-failed": {
    title: "체크인을 실패했습니다.",
    description: "행사장 내 서포터즈에게 직접 체크인을 요청해주세요.",
  },
} as const satisfies Record<string, ErrorPageContent>;
