import type { CheckinInput } from "./checkin";

export type CheckinFieldErrors = Partial<Record<keyof CheckinInput, string>>;

export function normalizePhoneNumber(value: string) {
  return value.replace(/[^0-9]/g, "").slice(0, 11);
}

export function validateCheckinInput(input: CheckinInput): CheckinFieldErrors {
  const errors: CheckinFieldErrors = {};
  const name = input.name.trim();
  const phoneNumber = normalizePhoneNumber(input.phoneNumber);

  if (!name) {
    errors.name = "이름을 입력해주세요.";
  }

  if (!/^01[016789]\d{7,8}$/.test(phoneNumber)) {
    errors.phoneNumber = "휴대폰 번호를 정확히 입력해주세요.";
  }

  return errors;
}
