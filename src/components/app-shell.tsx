"use client";

import type { ReactNode } from "react";
import { CheckinFooter } from "./checkin-footer";
import { CheckinHeader } from "./checkin-header";
import { Providers } from "./providers";

type AppShellProps = {
  children: ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  const classes = ["site-shell", className].filter(Boolean).join(" ");

  return (
    <Providers>
      <div className={classes}>
        <CheckinHeader />
        {children}
        <CheckinFooter />
      </div>
    </Providers>
  );
}
