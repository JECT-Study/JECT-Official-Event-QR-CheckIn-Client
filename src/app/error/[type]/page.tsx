import { notFound } from "next/navigation";
import { ClientOnlyErrorPage } from "@/components/client-only-error-page";
import { ERROR_PAGE_CONTENT, isErrorPageType } from "@/lib/error-page";

type ErrorPageProps = {
  params: Promise<{ type: string }>;
};

export async function generateMetadata({ params }: ErrorPageProps) {
  const { type } = await params;
  if (!isErrorPageType(type)) return {};

  return {
    title: `${ERROR_PAGE_CONTENT[type].title} | 젝트 체크인 폼`,
    description: ERROR_PAGE_CONTENT[type].description,
  };
}

export default async function ErrorPage({ params }: ErrorPageProps) {
  const { type } = await params;
  if (!isErrorPageType(type)) notFound();

  return <ClientOnlyErrorPage content={ERROR_PAGE_CONTENT[type]} />;
}
