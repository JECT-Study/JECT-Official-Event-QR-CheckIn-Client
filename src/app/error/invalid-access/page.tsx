import type { Metadata } from "next";
import { ClientOnlyErrorPage } from "@/components/client-only-error-page";
import { ERROR_PAGE_CONTENT } from "@/lib/error-page";

const content = ERROR_PAGE_CONTENT["invalid-access"];

export const metadata: Metadata = {
  title: "유효하지 않은 접근 | 젝트 체크인 폼",
  description: content.description,
};

export default function InvalidAccessPage() {
  return <ClientOnlyErrorPage content={content} />;
}
