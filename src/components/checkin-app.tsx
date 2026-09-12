"use client";

import Image from "next/image";
import { BlockButton } from "@jects/jds";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CheckinFooter } from "./checkin-footer";
import { CheckinForm } from "./checkin-form";
import { CheckinHeader } from "./checkin-header";
import { Providers } from "./providers";
import type { ActiveCheckinResult } from "@/lib/event";
import Spinner from "./spinner";

export default function CheckinApp({
  result,
}: {
  result: ActiveCheckinResult;
}) {
  const router = useRouter();
  const [isRefreshing, startRefreshing] = useTransition();
  const event = result.status === "available" ? result.event : null;

  const refresh = () => {
    startRefreshing(() => router.refresh());
  };

  return (
    <Providers>
      <div className="site-shell">
        <CheckinHeader />
        <main className="checkin-main">
          <section
            className="checkin-content"
            aria-labelledby={event ? "event-title" : undefined}
          >
            <header className="event-summary">
              {event && (
                <>
                  <h1 id="event-title" className="semantic-textStyle-title-4">
                    {event.title}
                  </h1>
                  <p className="event-date semantic-textStyle-body-xs-normal">
                    <Image src="/calendar.svg" width={16} height={16} alt="" />
                    <time>{event.dateTime}</time>
                  </p>
                  <Spinner />
                </>
              )}
              <p className="event-description semantic-textStyle-body-sm-normal">
                {event ? event.description : "체크인 가능 시간이 아닙니다."}
              </p>
            </header>
            {event ? (
              <CheckinForm event={event} />
            ) : (
              <div className="checkin-form">
                <BlockButton.Basic
                  type="button"
                  size="md"
                  hierarchy="tertiary"
                  disabled={isRefreshing}
                  onClick={refresh}
                >
                  {isRefreshing ? "새로 고침 중..." : "페이지 새로 고침"}
                </BlockButton.Basic>
              </div>
            )}
          </section>
        </main>
        <CheckinFooter />
      </div>
    </Providers>
  );
}
