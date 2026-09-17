import {
  API_ERROR_CODES,
  API_PATHS,
  createApiUrl,
  isApiErrorResponse,
  readJson,
} from "./api";

export type CheckinEvent = {
  title: string;
  dateTime: string;
};

type ActiveEventResponse = {
  status: "SUCCESS";
  data: {
    name: string;
    eventDateTime: string;
  };
  timestamp: string;
};

const EVENT_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export type ActiveCheckinResult =
  | { status: "available"; event: CheckinEvent }
  | { status: "not-started" };

function isActiveEventResponse(value: unknown): value is ActiveEventResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  const event = response.data;

  return (
    response.status === "SUCCESS" &&
    typeof response.timestamp === "string" &&
    !!event &&
    typeof event === "object" &&
    typeof (event as Record<string, unknown>).name === "string" &&
    typeof (event as Record<string, unknown>).eventDateTime === "string"
  );
}

function formatEventDateTime(value: string): string {
  const match = EVENT_DATE_TIME_PATTERN.exec(value);
  if (!match)
    throw new Error("Event date time does not match the expected format");

  const [, year, month, day, hour, minute] = match;
  const dateParts = [year, month, day, hour, minute].map(Number);
  const [yearNumber, monthNumber, dayNumber, hourNumber, minuteNumber] =
    dateParts;
  const date = new Date(
    Date.UTC(yearNumber, monthNumber - 1, dayNumber, hourNumber, minuteNumber),
  );

  const isValidDate =
    date.getUTCFullYear() === yearNumber &&
    date.getUTCMonth() === monthNumber - 1 &&
    date.getUTCDate() === dayNumber &&
    date.getUTCHours() === hourNumber &&
    date.getUTCMinutes() === minuteNumber;

  if (!isValidDate) {
    throw new Error("Event date time contains an invalid date");
  }

  const weekday = WEEKDAYS[date.getUTCDay()];

  return `${yearNumber}년 ${monthNumber}월 ${dayNumber}일(${weekday}) ${hour}:${minute}`;
}

export async function getActiveCheckinEvent(
  signal?: AbortSignal,
): Promise<ActiveCheckinResult> {
  const eventUrl = createApiUrl(API_PATHS.activeEvent);

  const response = await fetch(eventUrl, { cache: "no-store", signal });
  const data = await readJson(response);

  if (
    response.status === 409 &&
    isApiErrorResponse(data) &&
    data.status === API_ERROR_CODES.eventNotStarted
  ) {
    return { status: "not-started" };
  }

  if (!response.ok) {
    throw new Error(`Event lookup failed with status ${response.status}`);
  }

  if (!isActiveEventResponse(data)) {
    throw new Error("Event response does not match the expected schema");
  }

  return {
    status: "available",
    event: {
      title: data.data.name,
      dateTime: formatEventDateTime(data.data.eventDateTime),
    },
  };
}
