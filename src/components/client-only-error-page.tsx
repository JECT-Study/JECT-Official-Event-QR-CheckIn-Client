"use client";

import dynamic from "next/dynamic";
import type { ErrorPageContent } from "@/lib/error-page";
import { LoadingScreen } from "./loading-screen";

const ErrorPage = dynamic(() => import("./error-page"), {
  ssr: false,
  loading: () => <LoadingScreen message="오류 안내를 불러오고 있습니다." />,
});

export function ClientOnlyErrorPage({ content }: { content: ErrorPageContent }) {
  return <ErrorPage content={content} />;
}
