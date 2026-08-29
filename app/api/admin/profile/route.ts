import { requireAdmin } from "@/lib/content/service";
import { revalidatePortfolio } from "@/lib/content/revalidate-portfolio";
import { withDb } from "@/lib/db/mongodb";
import { ProfileModel } from "@/lib/db/models/Profile";
import { profileSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const profile = await withDb(() =>
      ProfileModel.findOne({ slug: "default" }).lean(),
    );
    return jsonResponse(profile ?? null);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to load profile", 500);
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid profile", 400);
    }

    const profile = await withDb(() =>
      ProfileModel.findOneAndUpdate(
        { slug: "default" },
        { $set: parsed.data },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      ).lean(),
    );

    await revalidatePortfolio();
    return jsonResponse(profile);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to save profile", 500);
  }
}
