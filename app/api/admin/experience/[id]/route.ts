import { requireAdmin } from "@/lib/content/service";
import { revalidatePortfolio } from "@/lib/content/revalidate-portfolio";
import { withDb } from "@/lib/db/mongodb";
import { ExperienceModel } from "@/lib/db/models/Experience";
import { experienceSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = experienceSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid experience", 400);
    }

    const item = await withDb(() =>
      ExperienceModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean(),
    );
    if (!item) return errorResponse("Experience not found", 404);
    await revalidatePortfolio();
    return jsonResponse(item);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to update experience", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const item = await withDb(() => ExperienceModel.findByIdAndDelete(id).lean());
    if (!item) return errorResponse("Experience not found", 404);
    await revalidatePortfolio();
    return jsonResponse({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to delete experience", 500);
  }
}
