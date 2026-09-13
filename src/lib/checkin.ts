import { isApiErrorResponse, readJson } from "./api";

export type CheckinInput = { name: string; phoneNumber: string };
export type CheckinDialogContent = { title: string; body: string };
export type CheckinResult =
  | { status: "success" }
  | { status: "already-checked-in" }
  | { status: "dialog"; content: CheckinDialogContent }
  | { status: "unhandled-error" };

const SUPPORT_REQUEST_MESSAGE =
  "행사장 내 서포터즈에게 직접 체크인을 요청해주세요.";
const SUPPORT_INQUIRY_MESSAGE = "행사장 내 서포터즈에게 문의해주세요";

function classifyCheckinError(
  httpStatus: number,
  response: unknown,
): CheckinResult {
  if (httpStatus !== 409 || !isApiErrorResponse(response)) {
    return { status: "unhandled-error" };
  }

  switch (response.status) {
    case "CHECKIN-001":
      return {
        status: "dialog",
        content: {
          title: "체크인이 마감되었습니다",
          body: SUPPORT_REQUEST_MESSAGE,
        },
      };
    case "CHECKIN-002":
      return { status: "already-checked-in" };
    case "CHECKIN-003":
    case "CHECKIN-004":
    case "CHECKIN-005":
      return {
        status: "dialog",
        content: {
          title: response.data[0] || "체크인 처리에 실패했습니다.",
          body: SUPPORT_INQUIRY_MESSAGE,
        },
      };
    default:
      return { status: "unhandled-error" };
  }
}

export async function submitCheckin(
  submissionEndpoint: string,
  input: CheckinInput,
  signal?: AbortSignal,
): Promise<CheckinResult> {
  const response = await fetch(submissionEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    return classifyCheckinError(response.status, await readJson(response));
  }

  return { status: "success" };
}
