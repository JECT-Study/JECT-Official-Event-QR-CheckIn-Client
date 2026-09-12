"use client";

import Image from "next/image";
import { Toast } from "@jects/jds";

type SubmissionDelayToastProps = {
  open: boolean;
  onClose: () => void;
};

export function SubmissionDelayToast({
  open,
  onClose,
}: SubmissionDelayToastProps) {
  if (!open) return null;

  return (
    <div className="submission-delay-toast">
      <Toast.Basic
        id="submission-delay"
        title={
          <span className="submission-delay-toast__message">
            <Image src="/caution.svg" width={16} height={16} alt="" />
            <span>응답이 지연되고 있습니다. 다시 시도해주세요.</span>
          </span>
        }
        onRemove={onClose}
      />
    </div>
  );
}
