"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "./loading-screen";

const CheckinApp = dynamic(() => import("./checkin-app"), {
  ssr: false,
  loading: () => <LoadingScreen message="체크인 폼을 불러오고 있습니다." />,
});

export function ClientOnlyCheckin() {
  return <CheckinApp />;
}
