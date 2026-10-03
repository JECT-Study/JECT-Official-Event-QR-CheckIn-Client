"use client";

import { BlockButton } from "@jects/jds";
import { textStyles } from "@jects/jds/tokens";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "./app-shell";
import { CompletedEventTimetable } from "./completed-event-timetable";
import { CheckinForm } from "./checkin-form";
import { PinIcon } from "./icons/pin-icon";
import { LoadingScreen } from "./loading-screen";
import { useActiveCheckinEvent } from "@/hooks/use-active-checkin-event";
import { APP_ROUTES } from "@/lib/routes";

type CheckinStatus = "form" | "completed" | "already-checked-in";

const DESCRIPTION_BY_STATUS: Record<Exclude<CheckinStatus, "form">, string> = {
  completed: "체크인이 완료되었습니다.",
  "already-checked-in": "이미 체크인 처리되었습니다.",
};

export default function CheckinApp() {
  const router = useRouter();
  const { result, error, isLoading, refetch } = useActiveCheckinEvent();
  const [checkinStatus, setCheckinStatus] = useState<CheckinStatus>("form");

  useEffect(() => {
    if (error) router.replace(APP_ROUTES.invalidAccess);
  }, [error, router]);

  if (!result) {
    return <LoadingScreen />;
  }

  const event = result.status === "available" ? result.event : null;
  const description = event
    ? checkinStatus === "form"
      ? event.description
      : DESCRIPTION_BY_STATUS[checkinStatus]
    : "체크인 가능 시간이 아닙니다.";

  const refresh = () => {
    setCheckinStatus("form");
    refetch();
  };

  return (
    <AppShell onHomeClick={refresh}>
      <main className="checkin-main">
        <section
          className="checkin-content"
          aria-labelledby={event ? "event-title" : undefined}
        >
          <header className="event-summary">
            {event && (
              <>
                <h1
                  id="event-title"
                  className="event-title"
                  style={textStyles.title[4]}
                >
                  {event.title}
                </h1>
                <div
                  className="event-details"
                  style={textStyles.label.md.normal}
                >
                  <div className="event-detail">
                    <div
                      className="event-detail__icon event-calendar"
                      aria-hidden="true"
                    >
                      <span
                        className="event-calendar__month"
                        style={textStyles.label.xs.normal}
                      >
                        {event.month}
                      </span>
                      <span
                        className="event-calendar__day"
                        style={textStyles.label.sm.normal}
                      >
                        {event.day}
                      </span>
                    </div>
                    <div className="event-detail__text">
                      <p>
                        <time dateTime={event.date}>{event.dateLabel}</time>
                      </p>
                      <p className="event-detail__secondary">
                        {event.timeLabel}
                      </p>
                    </div>
                  </div>
                  <div className="event-detail">
                    <div className="event-detail__icon" aria-hidden="true">
                      <PinIcon />
                    </div>
                    <div className="event-detail__text">
                      <p>{event.locationName}</p>
                      <p className="event-detail__secondary">
                        {event.locationAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
            {description && (
              <p className="event-description" style={textStyles.body.md.normal}>
                {description}
              </p>
            )}
          </header>
          {event && checkinStatus === "form" && (
            <CheckinForm
              onComplete={() => setCheckinStatus("completed")}
              onAlreadyCheckedIn={() => setCheckinStatus("already-checked-in")}
            />
          )}
          {event && checkinStatus !== "form" && (
            <CompletedEventTimetable />
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
