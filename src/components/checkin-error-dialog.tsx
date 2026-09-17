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
      ref={(element) => {
        if (element) element.dataset.checkinDialog = "";
      }}
      open
      buttonLayout="vertical"
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      header={content.title}
      body={
        <span className="checkin-dialog__description">{content.body}</span>
      }
      primaryAction={{
        children: "확인",
        onClick: onClose,
      }}
    />
  );
}
