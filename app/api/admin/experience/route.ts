import { requireAdmin } from "@/lib/content/service";
import { revalidatePortfolio } from "@/lib/content/revalidate-portfolio";
import { withDb } from "@/lib/db/mongodb";
import { ExperienceModel } from "@/lib/db/models/Experience";
import { experienceSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const items = await withDb(() =>
      ExperienceModel.find().sort({ order: 1, createdAt: -1 }).lean(),
    );
    return jsonResponse(items);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to load experience", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = experienceSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid experience", 400);
    }

    const count = await withDb(() => ExperienceModel.countDocuments());
    const item = await withDb(() =>
      ExperienceModel.create({ ...parsed.data, order: parsed.data.order ?? count }),
    );
    await revalidatePortfolio();
    return jsonResponse(item, 201);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to create experience", 500);
  }
}
