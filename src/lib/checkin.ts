export type CheckinInput = { name: string; phone: string };
export type CheckinResult =
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "invalid-event" }
  | { status: "error" };

const delay = (milliseconds: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, milliseconds);

    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(new DOMException("The request was aborted", "AbortError"));
      },
      { once: true },
    );
  });

export async function submitCheckin(
  eventId: string,
  submissionEndpoint: string,
  input: CheckinInput,
  signal?: AbortSignal,
): Promise<CheckinResult> {
  if (!submissionEndpoint.startsWith("mock://")) {
    const response = await fetch(submissionEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, ...input }),
      signal,
    });
    if (response.status === 409) return { status: "duplicate" };
    if (response.status === 404 || response.status === 410) return { status: "invalid-event" };
    if (!response.ok) return { status: "error" };
    return { status: "success" };
  }

  await delay(650, signal);
  if (input.name === "중복") return { status: "duplicate" };
  if (input.name === "오류") return { status: "error" };
  return { status: "success" };
}
