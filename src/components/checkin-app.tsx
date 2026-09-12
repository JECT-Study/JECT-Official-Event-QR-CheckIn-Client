"use client";

import Image from "next/image";
import { BlockButton } from "@jects/jds";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  const [checkinStatus, setCheckinStatus] = useState<
    "form" | "completed" | "already-checked-in"
  >("form");
  const event = result.status === "available" ? result.event : null;

  const description = event
    ? checkinStatus === "completed"
      ? "체크인이 완료되었습니다."
      : checkinStatus === "already-checked-in"
        ? "이미 체크인 처리되었습니다."
        : event.description
    : "체크인 가능 시간이 아닙니다.";

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
                </>
              )}
              <p className="event-description semantic-textStyle-body-sm-normal">
                {description}
              </p>
            </header>
            {event && checkinStatus === "form" && (
              <CheckinForm
                event={event}
                onComplete={() => setCheckinStatus("completed")}
                onAlreadyCheckedIn={() =>
                  setCheckinStatus("already-checked-in")
                }
              />
            )}
            {!event && (
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
