import Image from "next/image";
import Link from "next/link";
import { textStyles } from "@jects/jds/tokens";
import { APP_ROUTES } from "@/lib/routes";

type CheckinHeaderProps = {
  onHomeClick?: () => void;
};

export function CheckinHeader({ onHomeClick }: CheckinHeaderProps) {
  return (
    <header className="checkin-header">
      <div className="checkin-header__inner">
        <Link
          href={APP_ROUTES.home}
          className="checkin-header__home"
          aria-label="젝트 홈"
          onClick={onHomeClick}
        >
          <Image
            src="/ject_symbol.svg"
            width={14}
            height={14}
            alt=""
            priority
          />
          <span
            className="checkin-header__label"
            style={textStyles.label.lg.bold}
          >
            젝트 체크인 폼
          </span>
        </Link>
      </div>
    </header>
  );
}
