"use client";

import { useCallback, useEffect, useState } from "react";
import { getActiveCheckinEvent, type ActiveCheckinResult } from "@/lib/event";
import { hasSavedCheckin } from "@/lib/checkin-storage";
import { isAbortError } from "@/lib/errors";

type ActiveCheckinEventState = {
  result: ActiveCheckinResult | null;
  error: Error | null;
  isLoading: boolean;
  restoredCheckin: boolean;
};

const INITIAL_STATE: ActiveCheckinEventState = {
  result: null,
  error: null,
  isLoading: true,
  restoredCheckin: false,
};

export function useActiveCheckinEvent() {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    const controller = new AbortController();

    getActiveCheckinEvent(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setState({ result, error: null, isLoading: false,
          restoredCheckin: result.status === "available" && hasSavedCheckin(result.event),
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setState({
          result: null,
          error:
            error instanceof Error
              ? error
              : new Error("행사 조회에 실패했습니다."),
          isLoading: false,
          restoredCheckin: false,
        });
      });

    return () => controller.abort();
  }, [requestVersion]);

  const refetch = useCallback(() => {
    setState(INITIAL_STATE);
    setRequestVersion((current) => current + 1);
  }, []);

  return { ...state, refetch };
}
