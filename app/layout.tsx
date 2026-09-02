import type { Metadata } from "next";
import { NoirlyHead, noirlyFontClassName } from "@noirly-dev/ui";
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
      className="dark h-full"
      data-theme={themeId}
      suppressHydrationWarning
    >
      <head>
        <NoirlyHead themeId={themeId} />
      </head>
      <body className={`${noirlyFontClassName} flex min-h-full flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
