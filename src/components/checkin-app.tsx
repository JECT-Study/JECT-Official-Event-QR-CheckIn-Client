"use client";

import Image from "next/image";
import { CheckinFooter } from "./checkin-footer";
import { CheckinForm } from "./checkin-form";
import { CheckinHeader } from "./checkin-header";
import { Providers } from "./providers";
import type { CheckinEvent } from "@/lib/event";
import Spinner from "./spinner";

export default function CheckinApp({ event }: { event: CheckinEvent }) {
  return (
    <Providers>
      <div className="site-shell">
        <CheckinHeader />
        <main className="checkin-main">
          <section className="checkin-content" aria-labelledby="event-title">
            <header className="event-summary">
              <h1 id="event-title" className="semantic-textStyle-title-4">
                {event.title}
              </h1>
              <p className="event-date semantic-textStyle-body-xs-normal">
                <Image src="/calendar.svg" width={16} height={16} alt="" />
                <time>{event.dateTime}</time>
              </p>
              <Spinner />
              <p className="event-description semantic-textStyle-body-sm-normal">
                {event.description}
              </p>
            </header>
            <CheckinForm event={event} />
          </section>
        </main>
        <CheckinFooter />
      </div>
    </Providers>
  );
}
