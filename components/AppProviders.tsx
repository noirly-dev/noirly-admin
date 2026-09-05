"use client";

import type { ReactNode } from "react";
import { FaviconTheme } from "@/components/FaviconTheme";
import { ThemeProvider } from "@/components/ThemeProvider";

export function AppProviders({
  children,
  defaultThemeId,
}: {
  children: ReactNode;
  defaultThemeId: string;
}) {
  return (
    <ThemeProvider defaultThemeId={defaultThemeId}>
      <FaviconTheme />
      {children}
    </ThemeProvider>
  );
}
