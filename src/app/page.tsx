import { redirect } from "next/navigation";
import { ClientOnlyCheckin } from "@/components/client-only-checkin";
import { getActiveCheckinEvent } from "@/lib/event";

export default async function Home() {
  let event;

  try {
    event = await getActiveCheckinEvent();
  } catch {
    redirect("/error/invalid-access");
  }

  return <ClientOnlyCheckin event={event} />;
}
