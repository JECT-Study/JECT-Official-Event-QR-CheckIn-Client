import { redirect } from "next/navigation";
import { ClientOnlyCheckin } from "@/components/client-only-checkin";
import { getActiveCheckinEvent } from "@/lib/event";

export default async function Home() {
  let result;

  try {
    result = await getActiveCheckinEvent();
  } catch {
    redirect("/error/invalid-access");
  }

  return <ClientOnlyCheckin result={result} />;
}
