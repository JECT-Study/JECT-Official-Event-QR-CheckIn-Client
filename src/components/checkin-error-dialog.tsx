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
  if (!content) return null;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      header={content.title}
      body={content.body}
      primaryAction={{
        children: "확인",
        onClick: onClose,
      }}
    />
  );
}
