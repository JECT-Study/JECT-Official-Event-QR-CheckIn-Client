import type { Metadata } from "next";
import { ClientOnlyErrorPage } from "@/components/client-only-error-page";
import { ERROR_PAGE_CONTENT } from "@/lib/error-page";

const content = ERROR_PAGE_CONTENT["checkin-failed"];

export const metadata: Metadata = {
  title: `${content.title} | 젝트 체크인 폼`,
  description: content.description,
};

export default function CheckinFailedPage() {
  return <ClientOnlyErrorPage content={content} />;
}
