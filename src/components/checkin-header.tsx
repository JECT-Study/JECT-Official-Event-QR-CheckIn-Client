import { Logo } from "@jects/jds";

export function CheckinHeader() {
  return (
    <header className="checkin-header">
      <div className="checkin-header__inner">
        <Logo href="/" height={16} aria-label="젝트 홈" />
        <span className="checkin-header__label semantic-textStyle-label-sm-bold">체크인 폼</span>
      </div>
    </header>
  );
}
