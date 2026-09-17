"use client";

import { useState } from "react";
import { useToast } from "@jects/jds";
import { useRouter } from "next/navigation";
import {
  submitCheckin,
  type CheckinDialogContent,
  type CheckinInput,
} from "@/lib/checkin";
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
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [dialogContent, setDialogContent] =
    useState<CheckinDialogContent | null>(null);
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
        case "already-checked-in":
          onAlreadyCheckedIn();
          break;
        case "dialog":
          setDialogContent(result.content);
          break;
        case "unhandled-error":
          router.push("/error/checkin-failed");
          break;
      }
    } catch (error) {
      if (!(didTimeout && isAbortError(error))) {
        toast.notifying("연결이 불안정합니다. 다시 시도해주세요.");
      }
    } finally {
      window.clearTimeout(timeout);
      setIsPending(false);
    }
  };

  return {
    dialogContent,
    isDelayToastOpen,
    isPending,
    closeDelayToast: () => setIsDelayToastOpen(false),
    closeDialog: () => setDialogContent(null),
    submit,
  };
}
