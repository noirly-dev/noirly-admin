import { unstable_noStore as noStore } from "next/cache";
import { withDb } from "@/lib/db/mongodb";
import { SettingsModel } from "@/lib/db/models/Settings";
import { DEFAULT_THEME_ID } from "@/lib/themes/manifest";

export async function getActiveThemeId(): Promise<string> {
  noStore();
  try {
    const settings = await withDb(() =>
      SettingsModel.findOne({ slug: "portfolio" }).lean(),
    );
    return settings?.themeId ?? DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}
