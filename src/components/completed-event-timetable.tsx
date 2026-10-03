"use client";

import { useEffect, useState } from "react";
import { BlockButton } from "@jects/jds";
import { textStyles } from "@jects/jds/tokens";
import { getActiveEventTimetable, type EventTimetableRow } from "@/lib/timetable";
import { EventTimetable } from "./event-timetable";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "loaded"; rows: EventTimetableRow[] };

// Mounted only after a successful or already-completed check-in.
export function CompletedEventTimetable() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getActiveEventTimetable(controller.signal)
      .then((rows) => {
        if (!controller.signal.aborted) setState({ status: "loaded", rows });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: "error" });
      });
    return () => controller.abort();
  }, [requestVersion]);

  if (state.status === "loading") {
    return <p role="status" style={textStyles.body.md.normal}>타임테이블을 불러오는 중입니다.</p>;
  }
  if (state.status === "error") {
    return (
      <div className="checkin-form">
        <p role="alert" style={textStyles.body.md.normal}>타임테이블을 불러오지 못했습니다.</p>
        <BlockButton type="button" size="md" hierarchy="secondary" onClick={() => {
          setState({ status: "loading" });
          setRequestVersion((version) => version + 1);
        }}>
          타임테이블 다시 불러오기
        </BlockButton>
      </div>
    );
  }
  return <EventTimetable rows={state.rows} />;
}
