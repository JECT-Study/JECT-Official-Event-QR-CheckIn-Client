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
  } else if (name.length < 2) {
    errors.name = "이름을 두 글자 이상 입력해주세요.";
  }

  if (!phoneNumber) {
    errors.phoneNumber = "연락처를 입력해주세요.";
  } else if (!/^01[016789]\d{7,8}$/.test(phoneNumber)) {
    errors.phoneNumber = "올바른 휴대전화 번호를 입력해주세요.";
  }

  return errors;
}
