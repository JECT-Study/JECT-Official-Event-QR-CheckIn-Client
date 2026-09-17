"use client";

import type { ComponentProps, FormEvent } from "react";
import { useState } from "react";
import { BlockButton, TextField } from "@jects/jds";
import { textStyles } from "@jects/jds/tokens";
import {
  normalizePhoneNumber,
  validateCheckinInput,
  type CheckinFieldErrors,
} from "@/lib/checkin-validation";
import { useCheckinSubmission } from "@/hooks/use-checkin-submission";
import { CheckinErrorDialog } from "./checkin-error-dialog";
import { Spinner } from "./spinner";

type CheckinFormProps = {
  onComplete: () => void;
  onAlreadyCheckedIn: () => void;
};

type CheckinTextFieldProps = Pick<
  ComponentProps<typeof TextField.Input>,
  "autoComplete" | "inputMode" | "name" | "placeholder" | "type"
> & {
  disabled: boolean;
  error?: string;
  label: string;
  onValueChange: (value: string) => void;
  value: string;
};

function CheckinTextField({
  disabled,
  error,
  label,
  onValueChange,
  value,
  ...inputProps
}: CheckinTextFieldProps) {
  return (
    <TextField
      status={error ? "error" : "default"}
      disabled={disabled}
      required
    >
      <TextField.Label
        className="checkin-form__field-label"
        style={textStyles.label.sm.normal}
      >
        {label}
      </TextField.Label>
      <TextField.Input
        {...inputProps}
        className="checkin-form__field-input"
        style={textStyles.body.md.normal}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        required
      />
      {error && (
        <TextField.Footer>
          <TextField.Helper>{error}</TextField.Helper>
        </TextField.Footer>
      )}
    </TextField>
  );
}

export function CheckinForm({
  onComplete,
  onAlreadyCheckedIn,
}: CheckinFormProps) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [errors, setErrors] = useState<CheckinFieldErrors>({});
  const { closeDialog, dialogContent, isPending, submit } =
    useCheckinSubmission({
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
          <CheckinTextField
            name="name"
            label="이름"
            placeholder="김젝트"
            value={name}
            error={errors.name}
            disabled={isPending}
            autoComplete="name"
            onValueChange={(value) => {
              setName(value);
              if (errors.name)
                setErrors((current) => ({ ...current, name: undefined }));
            }}
          />
          <CheckinTextField
            name="phoneNumber"
            label="휴대폰 번호"
            type="tel"
            inputMode="numeric"
            placeholder="01012345678"
            value={phoneNumber}
            error={errors.phoneNumber}
            disabled={isPending}
            autoComplete="tel"
            onValueChange={(value) => {
              setPhone(normalizePhoneNumber(value));
              if (errors.phoneNumber)
                setErrors((current) => ({
                  ...current,
                  phoneNumber: undefined,
                }));
            }}
          />
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
