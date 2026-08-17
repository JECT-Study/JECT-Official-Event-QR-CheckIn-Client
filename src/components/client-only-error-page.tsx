"use client";

import dynamic from "next/dynamic";
import type { ErrorPageContent } from "@/lib/error-page";

const ErrorPage = dynamic(() => import("./error-page"), {
  ssr: false,
  loading: () => <div className="checkin-loading" role="status">오류 안내를 불러오고 있습니다.</div>,
});

export function ClientOnlyErrorPage({ content }: { content: ErrorPageContent }) {
  return <ErrorPage content={content} />;
}
