import type { CheckinEvent } from "./event";

type SavedEvent = Pick<CheckinEvent, "eventKey" | "checkinExpiresAt">;
const STORAGE_KEY = process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_MOCK_CHECKIN_EVENT === "true"
  ? "ject:checkin:preview:v1" : "ject:checkin:v1";

export function clearSavedCheckin(): void {
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage is optional. */ }
}

export function hasSavedCheckin(event: SavedEvent, now = Date.now()): boolean {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const record: unknown = JSON.parse(raw);
    if (record && typeof record === "object") {
      const value = record as Record<string, unknown>;
      if (value.eventKey === event.eventKey &&
        typeof value.checkedInAt === "number" && Number.isFinite(value.checkedInAt) &&
        typeof value.expiresAt === "number" && Number.isFinite(value.expiresAt) &&
        now < value.expiresAt && now < event.checkinExpiresAt) return true;
    }
    clearSavedCheckin();
  } catch { clearSavedCheckin(); }
  return false;
}

export function saveCheckin(event: SavedEvent, now = Date.now()): void {
  try {
    if (now >= event.checkinExpiresAt) {
      clearSavedCheckin();
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      eventKey: event.eventKey,
      checkedInAt: now,
      expiresAt: event.checkinExpiresAt,
    }));
  } catch { /* A storage failure must not undo a successful check-in. */ }
}
