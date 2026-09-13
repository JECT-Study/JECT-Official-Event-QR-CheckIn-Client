const PRODUCTION_API_BASE_URL = "https://checkin-api.ject.kr";
const DEVELOPMENT_API_BASE_URL = "/api";

export const API_PATHS = {
  activeEvent: "/dev/events/active",
  activeEventCheckin: "/events/active/check-in",
} as const;

export type ApiErrorResponse = {
  status: string;
  data: string[];
  timestamp: string;
};

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;

  return (
    typeof response.status === "string" &&
    Array.isArray(response.data) &&
    response.data.every((message) => typeof message === "string") &&
    typeof response.timestamp === "string"
  );
}

export async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_CHECKIN_API_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? DEVELOPMENT_API_BASE_URL
      : PRODUCTION_API_BASE_URL)
  );
}

export function createApiUrl(path: string) {
  const baseUrl = getApiBaseUrl();

  return baseUrl.startsWith("http")
    ? new URL(path, baseUrl).toString()
    : `${baseUrl.replace(/\/$/, "")}${path}`;
}
