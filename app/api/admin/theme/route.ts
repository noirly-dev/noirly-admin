import { requireAdmin } from "@/lib/content/service";
import { withDb } from "@/lib/db/mongodb";
import { SettingsModel } from "@/lib/db/models/Settings";
import { DEFAULT_THEME_ID, getTheme, PORTFOLIO_THEMES } from "@/lib/themes/manifest";
import { themeSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const settings = await withDb(() =>
      SettingsModel.findOne({ slug: "portfolio" }).lean(),
    );
    const themeId = settings?.themeId ?? DEFAULT_THEME_ID;
    const theme = getTheme(themeId) ?? getTheme(DEFAULT_THEME_ID)!;

    return jsonResponse({
      themeId: theme.id,
      themeName: theme.name,
      themes: PORTFOLIO_THEMES.map((t) => ({
        id: t.id,
        name: t.name,
        light: t.light,
        dark: t.dark,
      })),
    });
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to load theme", 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = themeSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid theme", 400);
    }

    const settings = await withDb(() =>
      SettingsModel.findOneAndUpdate(
        { slug: "portfolio" },
        { $set: { themeId: parsed.data.themeId } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).lean(),
    );

    const theme = getTheme(settings.themeId)!;
    return jsonResponse({ themeId: theme.id, themeName: theme.name });
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to save theme", 500);
  }
}
