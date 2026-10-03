import {
  API_ERROR_CODES,
  API_PATHS,
  createApiUrl,
  isApiErrorResponse,
  readJson,
} from "./api";

export type EventTimetableRow = {
  startTime: string;
  endTime: string;
  schedule: string;
};

type TimetableResponse = {
  status: "SUCCESS";
  data: EventTimetableRow[];
  timestamp: string;
};

function isTimetableResponse(value: unknown): value is TimetableResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  return (
    response.status === "SUCCESS" &&
    typeof response.timestamp === "string" &&
    Array.isArray(response.data) &&
    response.data.every((item: unknown) => {
      if (!item || typeof item !== "object") return false;
      const row = item as Record<string, unknown>;
      return typeof row.startTime === "string" &&
        typeof row.endTime === "string" &&
        typeof row.schedule === "string";
    })
  );
}

export async function getActiveEventTimetable(
  signal?: AbortSignal,
): Promise<EventTimetableRow[]> {
  signal?.throwIfAborted();
  let data: unknown;
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_MOCK_CHECKIN_EVENT === "true"
  ) {
    data = {
      status: "SUCCESS",
      data: [
        { startTime: "13:30", endTime: "14:00", schedule: "체크인" },
        { startTime: "14:10", endTime: "15:00", schedule: "젝트 협업 도구 세미나" },
        { startTime: "15:10", endTime: "15:30", schedule: "쉬는 시간" },
        { startTime: "17:30", endTime: "18:00", schedule: "공지사항 안내, 만족도 조사, 파트별 단체사진" },
      ],
      timestamp: "2026-07-30T08:25:00Z",
    } satisfies TimetableResponse;
  } else {
    const response = await fetch(createApiUrl(API_PATHS.activeEventTimetable), {
      method: "GET",
      cache: "no-store",
      signal,
    });
    data = await readJson(response);
    if (
      isApiErrorResponse(data) &&
      ((response.status === 404 && data.status === API_ERROR_CODES.activeEventNotFound) ||
        (response.status === 409 && data.status === API_ERROR_CODES.eventNotStarted))
    ) {
      return [];
    }
    if (!response.ok) {
      throw new Error(`Timetable lookup failed with status ${response.status}`);
    }
  }
  if (!isTimetableResponse(data)) {
    throw new Error("Timetable response does not match the expected schema");
  }
  return data.data;
}
