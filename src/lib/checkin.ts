export type CheckinInput = { name: string; phoneNumber: string };
export type CheckinResult =
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "invalid-event" }
  | { status: "error" };

export async function submitCheckin(
  submissionEndpoint: string,
  input: CheckinInput,
  signal?: AbortSignal,
): Promise<CheckinResult> {
  const response = await fetch(submissionEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  if (response.status === 409) return { status: "duplicate" };
  if (response.status === 404 || response.status === 410) {
    return { status: "invalid-event" };
  }
  if (!response.ok) return { status: "error" };

  return { status: "success" };
}
