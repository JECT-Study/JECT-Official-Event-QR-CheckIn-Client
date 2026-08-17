export type CheckinInput = { name: string; phone: string };
export type CheckinResult =
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "invalid-event" }
  | { status: "error" };

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function submitCheckin(
  eventId: string,
  submissionEndpoint: string,
  input: CheckinInput,
): Promise<CheckinResult> {
  if (!submissionEndpoint.startsWith("mock://")) {
    const response = await fetch(submissionEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, ...input }),
    });
    if (response.status === 409) return { status: "duplicate" };
    if (response.status === 404 || response.status === 410) return { status: "invalid-event" };
    if (!response.ok) return { status: "error" };
    return { status: "success" };
  }

  await delay(650);
  if (input.name === "중복") return { status: "duplicate" };
  if (input.name === "오류") return { status: "error" };
  return { status: "success" };
}
