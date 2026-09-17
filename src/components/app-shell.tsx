"use client";

import type { ReactNode } from "react";
import { CheckinFooter } from "./checkin-footer";
import { CheckinHeader } from "./checkin-header";
import { Providers } from "./providers";

type AppShellProps = {
  children: ReactNode;
  className?: string;
  onHomeClick?: () => void;
};

export function AppShell({ children, className, onHomeClick }: AppShellProps) {
  const classes = ["site-shell", className].filter(Boolean).join(" ");

  return (
    <Providers>
      <div className={classes}>
        <CheckinHeader onHomeClick={onHomeClick} />
        {children}
        <CheckinFooter />
      </div>
    </Providers>
  );
}
