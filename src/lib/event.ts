import {
  API_ERROR_CODES,
  API_PATHS,
  createApiUrl,
  isApiErrorResponse,
  readJson,
} from "./api";

export type CheckinEvent = {
  title: string;
  eventKey: string;
  checkinExpiresAt: number;
  description?: string;
  date: string;
  month: number;
  day: number;
  dateLabel: string;
  timeLabel: string;
  locationName: string;
  locationAddress: string;
};

type ActiveEventResponse = {
  status: "SUCCESS";
  data: {
    name: string;
    description?: string | null;
    eventDateTime: string;
    eventEndDateTime: string;
    eventLocationName: string;
    eventLocationAddress: string;
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
    ((event as Record<string, unknown>).description == null ||
      typeof (event as Record<string, unknown>).description === "string") &&
    ["eventDateTime", "eventEndDateTime", "eventLocationName", "eventLocationAddress"].every(
      (key) => typeof (event as Record<string, unknown>)[key] === "string",
    )
  );
}

function parseEventDateTime(value: string) {
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

  return {
    date: `${year}-${month}-${day}`,
    month: monthNumber,
    day: dayNumber,
    dateLabel: `${yearNumber}년 ${monthNumber}월 ${dayNumber}일(${weekday})`,
    time: `${hour}:${minute}`,
    timestamp: date.getTime(),
  };
}

export async function getActiveCheckinEvent(
  signal?: AbortSignal,
): Promise<ActiveCheckinResult> {
  let data: unknown;
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_MOCK_CHECKIN_EVENT === "true"
  ) {
    data = {
      status: "SUCCESS",
      data: {
        name: "JECT 행사 (테스트)",
        eventDateTime: "2026-10-10T14:00:00",
        eventEndDateTime: "2026-10-10T18:00:00",
        eventLocationName: "ICT CoC",
        eventLocationAddress: "서울 마포구 마포대로 122 6층 ICT콤플렉스",
      },
      timestamp: "2026-10-10T13:00:00",
    } satisfies ActiveEventResponse;
  } else {
    const eventUrl = createApiUrl(API_PATHS.activeEvent);

    const response = await fetch(eventUrl, { cache: "no-store", signal });
    data = await readJson(response);

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
  }

  if (!isActiveEventResponse(data)) {
    throw new Error("Event response does not match the expected schema");
  }

  const start = parseEventDateTime(data.data.eventDateTime);
  const end = parseEventDateTime(data.data.eventEndDateTime);
  if (end.timestamp < start.timestamp) {
    throw new Error("Event end must not precede its start");
  }

  return {
    status: "available",
    event: {
      title: data.data.name,
      eventKey: JSON.stringify([data.data.name, data.data.eventDateTime]),
      // API dates represent Korean local time; expire at the following midnight.
      checkinExpiresAt: Date.parse(`${end.date}T00:00:00+09:00`) + 86_400_000,
      description: data.data.description?.trim() || undefined,
      date: start.date,
      month: start.month,
      day: start.day,
      dateLabel: start.dateLabel,
      timeLabel: start.date === end.date
        ? `${start.time}~${end.time}`
        : `${start.time}~${end.dateLabel} ${end.time}`,
      locationName: data.data.eventLocationName,
      locationAddress: data.data.eventLocationAddress,
    },
  };
}
