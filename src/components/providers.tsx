"use client";

import { ToastProvider } from "@jects/jds";
import { JDSThemeProvider } from "@jects/jds/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return <JDSThemeProvider><ToastProvider>{children}</ToastProvider></JDSThemeProvider>;
}
