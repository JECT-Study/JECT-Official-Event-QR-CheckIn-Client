import {
  API_ERROR_CODES,
  API_PATHS,
  createApiUrl,
  isApiErrorResponse,
  readJson,
} from "./api";

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
const CHECKIN_INQUIRY_ERROR_CODES = new Set<string>([
  API_ERROR_CODES.checkinConfigurationRequired,
  API_ERROR_CODES.checkinSaveFailed,
  API_ERROR_CODES.memberMismatch,
]);

function classifyCheckinError(
  httpStatus: number,
  response: unknown,
): CheckinResult {
  if (httpStatus !== 409 || !isApiErrorResponse(response)) {
    return { status: "unhandled-error" };
  }

  switch (response.status) {
    case API_ERROR_CODES.checkinClosed:
      return {
        status: "dialog",
        content: {
          title: "체크인이 마감되었습니다",
          body: SUPPORT_REQUEST_MESSAGE,
        },
      };
    case API_ERROR_CODES.alreadyCheckedIn:
      return { status: "already-checked-in" };
  }

  if (CHECKIN_INQUIRY_ERROR_CODES.has(response.status)) {
    return {
      status: "dialog",
      content: {
        title: response.data[0] || "체크인 처리에 실패했습니다.",
        body: SUPPORT_INQUIRY_MESSAGE,
      },
    };
  }

  return { status: "unhandled-error" };
}

export async function submitCheckin(
  input: CheckinInput,
  signal?: AbortSignal,
): Promise<CheckinResult> {
  const response = await fetch(createApiUrl(API_PATHS.activeEventCheckin), {
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
