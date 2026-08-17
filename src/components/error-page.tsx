"use client";

import { CheckinFooter } from "./checkin-footer";
import { CheckinHeader } from "./checkin-header";
import { Providers } from "./providers";
import type { ErrorPageContent } from "@/lib/error-page";

function WarningSymbol() {
  return (
    <svg className="error-page__symbol" viewBox="0 0 120 104" aria-hidden="true">
      <path d="M51.3 5.1c3.9-6.8 13.5-6.8 17.4 0l49.9 86.4c3.9 6.7-1 15.1-8.7 15.1H10.1c-7.7 0-12.6-8.4-8.7-15.1L51.3 5.1Z" fill="#F8C961" />
      <rect x="54.5" y="32" width="11" height="38" rx="5.5" fill="#806529" />
      <circle cx="60" cy="84" r="6" fill="#806529" />
    </svg>
  );
}

export default function ErrorPage({ content }: { content: ErrorPageContent }) {
  return (
    <Providers>
      <div className="site-shell error-shell">
        <CheckinHeader />
        <main className="error-main">
          <section className="error-page" aria-labelledby="error-title">
            <WarningSymbol />
            <div className="error-page__copy">
              <h1 id="error-title" className="semantic-textStyle-label-lg-bold">{content.title}</h1>
              <p className="semantic-textStyle-body-xs-normal">{content.description}</p>
            </div>
          </section>
        </main>
        <CheckinFooter />
      </div>
    </Providers>
  );
}
