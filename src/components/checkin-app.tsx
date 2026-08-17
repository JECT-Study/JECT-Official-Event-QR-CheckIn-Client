"use client";

import { Icon } from "@jects/jds";
import { CheckinFooter } from "./checkin-footer";
import { CheckinForm } from "./checkin-form";
import { CheckinHeader } from "./checkin-header";
import { Providers } from "./providers";

const EVENT = { title: "젝트 5기 온보딩 체크인", dateTime: "2026년 9월 19일(토) 13:00" };

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
                <Icon name="calendar-line" size="2xs" aria-hidden="true" />
                <time>{EVENT.dateTime}</time>
              </p>
              <p className="event-description semantic-textStyle-body-sm-normal">
                구성원 확인을 위해 다음의 항목들을 작성 후 제출해주세요.
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
