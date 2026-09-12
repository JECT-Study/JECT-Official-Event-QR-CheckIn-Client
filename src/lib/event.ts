export type CheckinEvent = {
  id: string;
  slug: string;
  title: string;
  dateTime: string;
  description: string;
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
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value);
  if (!match) throw new Error("Event date time does not match the expected format");

  const [, year, month, day, hour, minute] = match;
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).getUTCDay()];

  return `${year}년 ${Number(month)}월 ${Number(day)}일(${weekday}) ${hour}:${minute}`;
}

export async function getActiveCheckinEvent(): Promise<CheckinEvent> {
  const apiBaseUrl = process.env.CHECKIN_API_BASE_URL || "https://checkin-api.ject.kr";
  const eventUrl = new URL("/dev/events/active", apiBaseUrl);

  const response = await fetch(eventUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Event lookup failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!isActiveEventResponse(data)) {
    throw new Error("Event response does not match the expected schema");
  }

  return {
    id: "active",
    slug: "active",
    title: data.data.name,
    dateTime: formatEventDateTime(data.data.eventDateTime),
    description: "구성원 확인을 위해 다음의 항목들을 작성 후 제출해주세요.",
    submissionEndpoint: "mock://checkin/active",
  };
}
