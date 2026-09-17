"use client";

import dynamic from "next/dynamic";
import type { ErrorPageContent } from "@/lib/error-page";
import { LoadingScreen } from "./loading-screen";

const ErrorPage = dynamic(() => import("./error-page"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export function ClientOnlyErrorPage({ content }: { content: ErrorPageContent }) {
  return <ErrorPage content={content} />;
}
