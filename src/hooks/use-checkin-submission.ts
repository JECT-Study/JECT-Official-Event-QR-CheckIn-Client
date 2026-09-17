"use client";

import { useCallback, useRef, useState } from "react";
import { useToast } from "@jects/jds";
import { useRouter } from "next/navigation";
import {
  submitCheckin,
  type CheckinDialogContent,
  type CheckinInput,
} from "@/lib/checkin";
import { isAbortError } from "@/lib/errors";
import { APP_ROUTES } from "@/lib/routes";

const SUBMISSION_TIMEOUT_MS = 5_000;

type UseCheckinSubmissionOptions = {
  onComplete: () => void;
  onAlreadyCheckedIn: () => void;
};

export function useCheckinSubmission({
  onComplete,
  onAlreadyCheckedIn,
}: UseCheckinSubmissionOptions) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [dialogContent, setDialogContent] =
    useState<CheckinDialogContent | null>(null);
  const submissionLockRef = useRef(false);

  const submit = useCallback(
    async (input: CheckinInput) => {
      if (submissionLockRef.current) return;

      submissionLockRef.current = true;
      setIsPending(true);

      const controller = new AbortController();
      let didTimeout = false;
      const timeout = window.setTimeout(() => {
        didTimeout = true;
        controller.abort();
      }, SUBMISSION_TIMEOUT_MS);

      try {
        const result = await submitCheckin(input, controller.signal);

        switch (result.status) {
          case "success":
            onComplete();
            break;
          case "already-checked-in":
            onAlreadyCheckedIn();
            break;
          case "dialog":
            setDialogContent(result.content);
            break;
          case "unhandled-error":
            router.push(APP_ROUTES.checkinFailed);
            break;
        }
      } catch (error) {
        if (didTimeout && isAbortError(error)) {
          toast.notifying("응답이 지연되고 있습니다. 다시 시도해주세요.");
        } else if (!isAbortError(error)) {
          toast.notifying("연결이 불안정합니다. 다시 시도해주세요.");
        }
      } finally {
        window.clearTimeout(timeout);
        submissionLockRef.current = false;
        setIsPending(false);
      }
    },
    [onAlreadyCheckedIn, onComplete, router, toast],
  );

  return {
    dialogContent,
    isPending,
    closeDialog: () => setDialogContent(null),
    submit,
  };
}
