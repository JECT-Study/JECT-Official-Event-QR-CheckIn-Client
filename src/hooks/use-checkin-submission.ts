"use client";

import { useState } from "react";
import { useToast } from "@jects/jds";
import { submitCheckin, type CheckinInput } from "@/lib/checkin";
import { isAbortError } from "@/lib/errors";

const SUBMISSION_TIMEOUT_MS = 5_000;

type UseCheckinSubmissionOptions = {
  endpoint: string;
  onComplete: () => void;
  onAlreadyCheckedIn: () => void;
};

export function useCheckinSubmission({
  endpoint,
  onComplete,
  onAlreadyCheckedIn,
}: UseCheckinSubmissionOptions) {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [isDelayToastOpen, setIsDelayToastOpen] = useState(false);

  const submit = async (input: CheckinInput) => {
    if (isPending) return;

    setIsPending(true);
    setIsDelayToastOpen(false);

    const controller = new AbortController();
    let didTimeout = false;
    const timeout = window.setTimeout(() => {
      didTimeout = true;
      setIsDelayToastOpen(true);
      controller.abort();
    }, SUBMISSION_TIMEOUT_MS);

    try {
      const result = await submitCheckin(endpoint, input, controller.signal);

      switch (result.status) {
        case "success":
          toast.positive("체크인이 완료되었습니다.");
          onComplete();
          break;
        case "duplicate":
          onAlreadyCheckedIn();
          break;
        case "invalid-event":
          setFailureMessage("체크인할 수 없는 행사입니다.");
          break;
        case "error":
          setFailureMessage("잠시 후 다시 시도해주세요.");
          break;
      }
    } catch (error) {
      if (!(didTimeout && isAbortError(error))) {
        setFailureMessage("잠시 후 다시 시도해주세요.");
      }
    } finally {
      window.clearTimeout(timeout);
      setIsPending(false);
    }
  };

  return {
    failureMessage,
    isDelayToastOpen,
    isPending,
    closeDelayToast: () => setIsDelayToastOpen(false),
    closeFailureDialog: () => setFailureMessage(null),
    submit,
  };
}
