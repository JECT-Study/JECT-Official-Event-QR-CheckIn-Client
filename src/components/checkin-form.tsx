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
import { textStyles } from "@jects/jds/tokens";

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
  const { closeDialog, dialogContent, isPending, submit } =
    useCheckinSubmission({
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
            status={errors.name ? "error" : "default"}
            disabled={isPending}
            required
          >
            <TextField.Label
              className="checkin-form__fields__label"
              style={textStyles.label.sm.normal}
            >
              이름
            </TextField.Label>
            <TextField.Input
              className="checkin-form__field-input"
              style={textStyles.body.md.normal}
              name="name"
              placeholder="김젝트"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (errors.name)
                  setErrors((current) => ({ ...current, name: undefined }));
              }}
              autoComplete="name"
              required
            />
            {errors.name && (
              <TextField.Footer>
                <TextField.Helper>{errors.name}</TextField.Helper>
              </TextField.Footer>
            )}
          </TextField>
          <TextField
            status={errors.phoneNumber ? "error" : "default"}
            disabled={isPending}
            required
          >
            <TextField.Label
              className="checkin-form__fields__label"
              style={textStyles.label.sm.normal}
            >
              휴대폰 번호
            </TextField.Label>
            <TextField.Input
              className="checkin-form__field-input"
              style={textStyles.body.md.normal}
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
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
              autoComplete="tel"
              required
            />
            {errors.phoneNumber && (
              <TextField.Footer>
                <TextField.Helper>{errors.phoneNumber}</TextField.Helper>
              </TextField.Footer>
            )}
          </TextField>
        </div>
        <BlockButton
          type="submit"
          size="md"
          className="checkin-form__submit-button"
          style={textStyles.label.lg.bold}
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
        </BlockButton>
      </form>
      <CheckinErrorDialog content={dialogContent} onClose={closeDialog} />
    </>
  );
}
