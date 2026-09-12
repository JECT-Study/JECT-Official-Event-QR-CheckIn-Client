const PRODUCTION_API_BASE_URL = "https://checkin-api.ject.kr";
const DEVELOPMENT_API_BASE_URL = "/api";

export const API_PATHS = {
  activeEvent: "/dev/events/active",
  activeEventCheckin: "/events/active/check-in",
} as const;

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
