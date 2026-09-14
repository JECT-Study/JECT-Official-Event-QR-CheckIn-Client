const PRODUCTION_API_BASE_URL = "https://checkin-api.ject.kr";
const DEVELOPMENT_API_BASE_URL = "/api";
const ALLOWED_PRODUCTION_API_ORIGINS = new Set([
  new URL(PRODUCTION_API_BASE_URL).origin,
]);

export const API_PATHS = {
  activeEvent: "/events/active",
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
  const baseUrl =
    process.env.NEXT_PUBLIC_CHECKIN_API_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? DEVELOPMENT_API_BASE_URL
      : PRODUCTION_API_BASE_URL);

  if (process.env.NODE_ENV === "development" && baseUrl.startsWith("/")) {
    return baseUrl;
  }

  let apiUrl: URL;

  try {
    apiUrl = new URL(baseUrl);
  } catch {
    throw new Error("체크인 API 주소가 올바른 URL 형식이 아닙니다.");
  }

  if (apiUrl.username || apiUrl.password) {
    throw new Error("체크인 API 주소에는 인증 정보를 포함할 수 없습니다.");
  }

  if (
    process.env.NODE_ENV !== "development" &&
    (apiUrl.protocol !== "https:" ||
      !ALLOWED_PRODUCTION_API_ORIGINS.has(apiUrl.origin))
  ) {
    throw new Error("허용되지 않은 운영 체크인 API 주소입니다.");
  }

  return apiUrl.origin;
}

export function createApiUrl(path: string) {
  const baseUrl = getApiBaseUrl();

  return baseUrl.startsWith("http")
    ? new URL(path, baseUrl).toString()
    : `${baseUrl.replace(/\/$/, "")}${path}`;
}
