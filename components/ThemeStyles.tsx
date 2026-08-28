import { buildThemeCss, DEFAULT_THEME_ID, getTheme } from "@/lib/themes/manifest";

export function ThemeStyles({ themeId }: { themeId: string }) {
  const theme = getTheme(themeId) ?? getTheme(DEFAULT_THEME_ID)!;
  const css = buildThemeCss(theme);

  return (
    <style
      id="noirly-admin-theme"
      dangerouslySetInnerHTML={{ __html: css }}
    />
  );
}
