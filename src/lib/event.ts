import { API_PATHS, createApiUrl } from "./api";

export type CheckinEvent = {
  title: string;
  dateTime: string;
  submissionEndpoint: string;
};

type ActiveEventResponse = {
  status: "SUCCESS";
  data: {
    name: string;
    eventDateTime: string;
  };
  timestamp: string;
};

type EventNotStartedResponse = {
  status: "EVENT-004";
  data: string[];
  timestamp: string;
};

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

function isEventNotStartedResponse(
  value: unknown,
): value is EventNotStartedResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;

  return (
    response.status === "EVENT-004" &&
    Array.isArray(response.data) &&
    response.data.every((message) => typeof message === "string") &&
    typeof response.timestamp === "string"
  );
}

function formatEventDateTime(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match)
    throw new Error("Event date time does not match the expected format");

  const [, year, month, day, hour, minute] = match;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday =
    weekdays[
      new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day)),
      ).getUTCDay()
    ];

  return `${year}년 ${Number(month)}월 ${Number(day)}일(${weekday}) ${hour}:${minute}`;
}

export async function getActiveCheckinEvent(
  signal?: AbortSignal,
): Promise<ActiveCheckinResult> {
  const eventUrl = createApiUrl(API_PATHS.activeEvent);

  const response = await fetch(eventUrl, { cache: "no-store", signal });
  const data: unknown = await response.json();

  if (response.status === 409 && isEventNotStartedResponse(data)) {
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
      submissionEndpoint: createApiUrl(API_PATHS.activeEventCheckin),
    },
  };
}
