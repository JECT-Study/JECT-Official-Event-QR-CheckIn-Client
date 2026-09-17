"use client";

import dynamic from "next/dynamic";
import { LoadingScreen } from "./loading-screen";

const CheckinApp = dynamic(() => import("./checkin-app"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export function ClientOnlyCheckin() {
  return <CheckinApp />;
}
