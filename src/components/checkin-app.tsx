"use client";

import { CheckinFooter } from "./checkin-footer";
import { CheckinForm } from "./checkin-form";
import { CheckinHeader } from "./checkin-header";
import { Providers } from "./providers";

const EVENT = { title: "젝트 오프라인 행사명을 입력합니다", dateTime: "YYYY년 M월 D일(aaa) HH:mm" };

export default function CheckinApp() {
  return (
    <Providers>
      <div className="site-shell">
        <CheckinHeader />
        <main className="checkin-main">
          <section className="checkin-content" aria-labelledby="event-title">
            <header className="event-summary">
              <h1 id="event-title" className="semantic-textStyle-title-4">{EVENT.title}</h1>
              <p className="event-date semantic-textStyle-body-xs-normal">
                <span className="calendar-icon" aria-hidden="true" />
                <time>{EVENT.dateTime}</time>
              </p>
              <p className="event-description semantic-textStyle-body-sm-normal">
                출석 확인을 위해 이름과 연락처를 입력해주세요.
              </p>
            </header>
            <CheckinForm eventTitle={EVENT.title} />
          </section>
        </main>
        <CheckinFooter />
      </div>
    </Providers>
  );
}
