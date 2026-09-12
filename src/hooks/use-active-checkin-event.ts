"use client";

import { useCallback, useEffect, useState } from "react";
import { getActiveCheckinEvent, type ActiveCheckinResult } from "@/lib/event";
import { isAbortError } from "@/lib/errors";

type ActiveCheckinEventState = {
  result: ActiveCheckinResult | null;
  error: Error | null;
  isLoading: boolean;
};

const INITIAL_STATE: ActiveCheckinEventState = {
  result: null,
  error: null,
  isLoading: true,
};

export function useActiveCheckinEvent() {
  const [requestVersion, setRequestVersion] = useState(0);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    const controller = new AbortController();

    getActiveCheckinEvent(controller.signal)
      .then((result) => {
        setState({ result, error: null, isLoading: false });
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setState({
          result: null,
          error:
            error instanceof Error
              ? error
              : new Error("행사 조회에 실패했습니다."),
          isLoading: false,
        });
      });

    return () => controller.abort();
  }, [requestVersion]);

  const refetch = useCallback(() => {
    setState((current) => ({ ...current, error: null, isLoading: true }));
    setRequestVersion((current) => current + 1);
  }, []);

  return { ...state, refetch };
}
