"use client";

import { textStyles } from "@jects/jds/tokens";
import Image from "next/image";
import { AppShell } from "./app-shell";
import type { ErrorPageContent } from "@/lib/error-page";

export default function ErrorPage({ content }: { content: ErrorPageContent }) {
  return (
    <AppShell className="error-shell">
      <main className="error-main">
        <section className="error-page" aria-labelledby="error-title">
          <Image src="/warning.svg" width={64} height={64} alt="" />
          <div className="error-page__copy">
            <h1
              id="error-title"
              className="error-title"
              style={textStyles.title[1]}
            >
              {content.title}
            </h1>
            <p style={textStyles.body.md.normal}>{content.description}</p>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
