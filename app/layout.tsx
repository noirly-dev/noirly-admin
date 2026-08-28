import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { ThemeStyles } from "@/components/ThemeStyles";
import { getActiveThemeId } from "@/lib/themes/get-active-theme";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

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
      className={`${hanken.variable} ${fraunces.variable} ${jetbrains.variable} h-full dark`}
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
