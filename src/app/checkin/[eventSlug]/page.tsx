import { redirect } from "next/navigation";
import { ClientOnlyCheckin } from "@/components/client-only-checkin";
import { getCheckinEvent } from "@/lib/event";

type CheckinPageProps = {
  params: Promise<{ eventSlug: string }>;
};

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { eventSlug } = await params;
  let event;

  try {
    event = await getCheckinEvent(eventSlug);
  } catch {
    redirect("/error/invalid-access");
  }

  return <ClientOnlyCheckin event={event} />;
}
