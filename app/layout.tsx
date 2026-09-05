import type { Metadata } from "next";
import { NoirlyHead, noirlyFontClassName } from "@noirly-dev/ui";
import { NoirlyExperience } from "@noirly-dev/ui/experience";
import { AppProviders } from "@/components/AppProviders";
import { getActiveThemeId } from "@/lib/themes/get-active-theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noirly Admin",
  description: "Premium portfolio content management for Noirly",
  icons: {
    icon: [
      {
        url: "/brand-mark-light.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/brand-mark-dark.svg",
        type: "image/svg+xml",
        media: "(prefers-color-scheme: dark)",
      },
    ],
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
        <NoirlyExperience mark="Noirly Admin" pageTransition={false}>
          <AppProviders defaultThemeId={themeId}>{children}</AppProviders>
        </NoirlyExperience>
      </body>
    </html>
  );
}
