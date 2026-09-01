import type { Metadata } from "next";
import { ThemeStyles, noirlyFontClassName } from "@noirly-dev/ui";
import { getActiveThemeId } from "@/lib/themes/get-active-theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noirly Admin",
  description: "Premium portfolio content management for Noirly",
  icons: {
    icon: "/logo.svg",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const themeId = await getActiveThemeId();

  return (
    <html
      lang="en"
      className={`${noirlyFontClassName} h-full dark`}
      data-theme={themeId}
      suppressHydrationWarning
    >
      <head>
        <ThemeStyles themeId={themeId} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
