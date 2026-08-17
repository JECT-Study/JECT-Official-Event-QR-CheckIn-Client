"use client";

import { FormEvent, useState } from "react";
import { BlockButton, Icon, TextField, useToast } from "@jects/jds";
import { useRouter } from "next/navigation";
import { submitCheckin } from "@/lib/checkin";
import type { CheckinEvent } from "@/lib/event";

type FieldErrors = Partial<Record<"name" | "phone", string>>;
const normalizePhone = (value: string) => value.replace(/[^0-9]/g, "").slice(0, 11);

function validate(name: string, phone: string): FieldErrors {
  const errors: FieldErrors = {};
  if (!name.trim()) errors.name = "이름을 입력해주세요.";
  else if (name.trim().length < 2) errors.name = "이름을 두 글자 이상 입력해주세요.";
  const phoneNumbers = normalizePhone(phone);
  if (!phoneNumbers) errors.phone = "연락처를 입력해주세요.";
  else if (!/^01[016789]\d{7,8}$/.test(phoneNumbers)) {
    errors.phone = "올바른 휴대전화 번호를 입력해주세요.";
  }
  return errors;
}

export function CheckinForm({ event }: { event: CheckinEvent }) {
  const { toast } = useToast();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isPending, setIsPending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (isPending) return;
    const nextErrors = validate(name, phone);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.destructive("입력 내용을 다시 확인해주세요.");
      return;
    }

    setIsPending(true);
    try {
      const result = await submitCheckin(event.id, event.submissionEndpoint, {
        name: name.trim(),
        phone: normalizePhone(phone),
      });
      if (result.status === "success") {
        setIsComplete(true);
        toast.positive("체크인이 완료되었습니다.");
      } else if (result.status === "duplicate") {
        toast.basic("이미 체크인이 완료된 정보입니다.");
      } else if (result.status === "invalid-event") {
        router.push("/error/invalid-access");
      } else {
        router.push("/error/checkin-failed");
      }
    } catch {
      router.push("/error/checkin-failed");
    } finally {
      setIsPending(false);
    }
  };

  if (isComplete) {
    return (
      <section className="completion" aria-labelledby="completion-title" aria-live="polite">
        <span className="completion__icon" aria-hidden="true"><Icon name="check-line" size="xl" /></span>
        <div>
          <h2 id="completion-title" className="semantic-textStyle-title-6">체크인이 완료되었습니다</h2>
          <p className="semantic-textStyle-body-sm-normal">
            {name}님, {event.title} 출석이 확인되었습니다.
          </p>
        </div>
      </section>
    );
  }

  return (
    <form className="checkin-form" onSubmit={handleSubmit} noValidate>
      <div className="checkin-form__fields">
        <TextField
          name="name"
          label="이름"
          placeholder="김젝트"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
          }}
          validation={errors.name ? "error" : "none"}
          helperText={errors.name}
          autoComplete="name"
          disabled={isPending}
          required
        />
        <TextField
          name="phone"
          type="tel"
          inputMode="numeric"
          label="휴대폰 번호"
          placeholder="01012345678"
          value={phone}
          onChange={(event) => {
            setPhone(normalizePhone(event.target.value));
            if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
          }}
          validation={errors.phone ? "error" : "none"}
          helperText={errors.phone}
          autoComplete="tel"
          disabled={isPending}
          required
        />
      </div>
      <BlockButton.Basic type="submit" size="md" hierarchy="primary" disabled={isPending}>
        {isPending ? "제출 중..." : "제출하기"}
      </BlockButton.Basic>
    </form>
  );
}
