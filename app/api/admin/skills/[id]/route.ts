import { requireAdmin } from "@/lib/content/service";
import { withDb } from "@/lib/db/mongodb";
import { SkillModel } from "@/lib/db/models/Skill";
import { skillSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = skillSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid skill", 400);
    }

    const item = await withDb(() =>
      SkillModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean(),
    );
    if (!item) return errorResponse("Skill not found", 404);
    return jsonResponse(item);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to update skill", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const item = await withDb(() => SkillModel.findByIdAndDelete(id).lean());
    if (!item) return errorResponse("Skill not found", 404);
    return jsonResponse({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to delete skill", 500);
  }
}
