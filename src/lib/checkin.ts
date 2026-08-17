export type CheckinInput = { name: string; phone: string };
export type CheckinResult =
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "invalid-event" }
  | { status: "error" };

const delay = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export async function submitCheckin(input: CheckinInput): Promise<CheckinResult> {
  const endpoint = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (endpoint) {
    const response = await fetch(`${endpoint}/check-ins`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
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
