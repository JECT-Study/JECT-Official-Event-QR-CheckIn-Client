"use client";

import { Dialog } from "@jects/jds";
import type { CheckinDialogContent } from "@/lib/checkin";

type CheckinErrorDialogProps = {
  content: CheckinDialogContent | null;
  onClose: () => void;
};

export function CheckinErrorDialog({
  content,
  onClose,
}: CheckinErrorDialogProps) {
  return (
    <Dialog
      open={content !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      header={content?.title ?? ""}
      body={content?.body ?? ""}
      primaryAction={{
        children: "확인",
        onClick: onClose,
      }}
    />
  );
}
