export type CheckinEvent = {
  id: string;
  slug: string;
  title: string;
  dateTime: string;
  description: string;
  submissionEndpoint: string;
};

const MOCK_EVENT: CheckinEvent = {
  id: "event-ject-5th-onboarding",
  slug: "ject-5th-onboarding",
  title: "젝트 5기 온보딩 체크인",
  dateTime: "2026년 9월 19일(토) 13:00",
  description: "구성원 확인을 위해 다음의 항목들을 작성 후 제출해주세요.",
  submissionEndpoint: "mock://checkin/ject-5th-onboarding",
};

type EventResponse = Omit<CheckinEvent, "slug" | "description"> & { description?: string };

function isEventResponse(value: unknown): value is EventResponse {
  if (!value || typeof value !== "object") return false;
  const event = value as Record<string, unknown>;
  return (
    typeof event.id === "string" &&
    typeof event.title === "string" &&
    typeof event.dateTime === "string" &&
    (event.description === undefined || typeof event.description === "string") &&
    typeof event.submissionEndpoint === "string"
  );
}

export async function getCheckinEvent(eventSlug: string): Promise<CheckinEvent> {
  const apiBaseUrl = process.env.CHECKIN_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    return { ...MOCK_EVENT, slug: eventSlug };
  }

  const eventUrl = new URL(`/events/${encodeURIComponent(eventSlug)}`, apiBaseUrl);
  const response = await fetch(eventUrl, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Event lookup failed with status ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!isEventResponse(data)) {
    throw new Error("Event response does not match the expected schema");
  }

  return {
    ...data,
    slug: eventSlug,
    description:
      data.description ?? "구성원 확인을 위해 다음의 항목들을 작성 후 제출해주세요.",
    submissionEndpoint: new URL(data.submissionEndpoint, eventUrl).toString(),
  };
}
