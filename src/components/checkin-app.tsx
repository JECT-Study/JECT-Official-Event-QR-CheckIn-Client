"use client";

import { BlockButton } from "@jects/jds";
import { textStyles } from "@jects/jds/tokens";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "./app-shell";
import { CheckinForm } from "./checkin-form";
import { CalendarIcon } from "./icons/calendar-icon";
import { LoadingScreen } from "./loading-screen";
import { useActiveCheckinEvent } from "@/hooks/use-active-checkin-event";

type CheckinStatus = "form" | "completed" | "already-checked-in";

const DESCRIPTION_BY_STATUS: Record<CheckinStatus, string> = {
  form: "구성원 확인을 위해 다음의 항목들을 작성 후 제출해주세요.",
  completed: "체크인이 완료되었습니다.",
  "already-checked-in": "이미 체크인 처리되었습니다.",
};

export default function CheckinApp() {
  const router = useRouter();
  const { result, error, isLoading, refetch } = useActiveCheckinEvent();
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus>("form");

  useEffect(() => {
    if (error) router.replace("/error/invalid-access");
  }, [error, router]);

  if (!result) {
    return <LoadingScreen />;
  }

  const event = result.status === "available" ? result.event : null;
  const description = event
    ? DESCRIPTION_BY_STATUS[checkinStatus]
    : "체크인 가능 시간이 아닙니다.";

  const refresh = () => {
    setCheckinStatus("form");
    refetch();
  };

  return (
    <AppShell>
      <main className="checkin-main">
        <section
          className="checkin-content"
          aria-labelledby={event ? "event-title" : undefined}
        >
          <header className="event-summary">
            {event && (
              <>
                <h1 className="event-title" style={textStyles.title[4]}>
                  {event.title}
                </h1>
                <p className="event-date" style={textStyles.label.md.normal}>
                  <CalendarIcon />
                  <time>{event.dateTime}</time>
                </p>
              </>
            )}
            <p className="event-description" style={textStyles.body.md.normal}>
              {description}
            </p>
          </header>
          {event && checkinStatus === "form" && (
            <CheckinForm
              event={event}
              onComplete={() => setCheckinStatus("completed")}
              onAlreadyCheckedIn={() => setCheckinStatus("already-checked-in")}
            />
          )}
          {!event && (
            <div className="checkin-form">
              <BlockButton
                type="button"
                size="md"
                hierarchy="secondary"
                disabled={isLoading}
                onClick={refresh}
              >
                {isLoading ? "새로 고침 중..." : "새로 고침"}
              </BlockButton>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}
