import Image from "next/image";
import Link from "next/link";

export function CheckinHeader() {
  return (
    <header className="checkin-header">
      <div className="checkin-header__inner">
        <Link href="/" className="checkin-header__home" aria-label="젝트 홈">
          <Image src="/ject_symbol.svg" width={14} height={14} alt="" priority />
        </Link>
        <span className="checkin-header__label semantic-textStyle-label-sm-bold">
          체크인 폼
        </span>
      </div>
    </header>
  );
}
