"use client";

import { FormEvent, useState } from "react";
import { BlockButton, TextField } from "@jects/jds";
import {
  normalizePhoneNumber,
  validateCheckinInput,
  type CheckinFieldErrors,
} from "@/lib/checkin-validation";
import type { CheckinEvent } from "@/lib/event";
import { useCheckinSubmission } from "@/hooks/use-checkin-submission";
import { CheckinErrorDialog } from "./checkin-error-dialog";
import { Spinner } from "./spinner";
import { SubmissionDelayToast } from "./submission-delay-toast";

type CheckinFormProps = {
  event: CheckinEvent;
  onComplete: () => void;
  onAlreadyCheckedIn: () => void;
};

export function CheckinForm({
  event,
  onComplete,
  onAlreadyCheckedIn,
}: CheckinFormProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [errors, setErrors] = useState<CheckinFieldErrors>({});
  const {
    closeDelayToast,
    closeDialog,
    dialogContent,
    isDelayToastOpen,
    isPending,
    submit,
  } = useCheckinSubmission({
    endpoint: event.submissionEndpoint,
    onComplete,
    onAlreadyCheckedIn,
  });

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const input = {
      name: name.trim(),
      phoneNumber: normalizePhoneNumber(phoneNumber),
    };
    const nextErrors = validateCheckinInput(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await submit(input);
  };

  return (
    <>
      <form className="checkin-form" onSubmit={handleSubmit} noValidate>
        <div className="checkin-form__fields">
          <TextField
            name="name"
            label="이름"
            placeholder="김젝트"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name)
                setErrors((current) => ({ ...current, name: undefined }));
            }}
            validation={errors.name ? "error" : "none"}
            helperText={errors.name}
            autoComplete="name"
            disabled={isPending}
            required
          />
          <TextField
            name="phoneNumber"
            type="tel"
            inputMode="numeric"
            label="휴대폰 번호"
            placeholder="01012345678"
            value={phoneNumber}
            onChange={(event) => {
              setPhone(normalizePhoneNumber(event.target.value));
              if (errors.phoneNumber)
                setErrors((current) => ({
                  ...current,
                  phoneNumber: undefined,
                }));
            }}
            validation={errors.phoneNumber ? "error" : "none"}
            helperText={errors.phoneNumber}
            autoComplete="tel"
            disabled={isPending}
            required
          />
        </div>
        <BlockButton.Basic
          type="submit"
          size="md"
          hierarchy="primary"
          disabled={isPending}
        >
          제출하기
          {isPending && (
            <Spinner
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              role={undefined}
            />
          )}
        </BlockButton.Basic>
      </form>
      <SubmissionDelayToast open={isDelayToastOpen} onClose={closeDelayToast} />
      <CheckinErrorDialog content={dialogContent} onClose={closeDialog} />
    </>
  );
}
