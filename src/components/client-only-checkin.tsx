"use client";

import dynamic from "next/dynamic";
import type { CheckinEvent } from "@/lib/event";

const CheckinApp = dynamic(() => import("./checkin-app"), {
  ssr: false,
  loading: () => <div className="checkin-loading" role="status">체크인 폼을 불러오고 있습니다.</div>,
});

export function ClientOnlyCheckin({ event }: { event: CheckinEvent }) {
  return <CheckinApp event={event} />;
}
