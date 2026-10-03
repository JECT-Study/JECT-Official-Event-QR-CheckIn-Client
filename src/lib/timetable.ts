import {
  API_ERROR_CODES,
  API_PATHS,
  createApiUrl,
  isApiErrorResponse,
  readJson,
} from "./api";

export type EventTimetableRow = {
  startTime: string;
  endTime: string | null;
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
        (row.endTime === null || typeof row.endTime === "string") &&
        typeof row.schedule === "string";
    })
  );
}

export async function getActiveEventTimetable(
  signal?: AbortSignal,
): Promise<EventTimetableRow[]> {
  signal?.throwIfAborted();
  const isPreview = process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_MOCK_CHECKIN_EVENT === "true";
  const response = await fetch(createApiUrl(
    isPreview ? API_PATHS.previewTimetable : API_PATHS.activeEventTimetable,
  ), { method: "GET", cache: "no-store", signal });
  const data = await readJson(response);
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
  if (!isTimetableResponse(data)) {
    throw new Error("Timetable response does not match the expected schema");
  }
  return data.data;
}
