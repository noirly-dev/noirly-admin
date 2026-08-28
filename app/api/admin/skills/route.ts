import { requireAdmin } from "@/lib/content/service";
import { withDb } from "@/lib/db/mongodb";
import { SkillModel } from "@/lib/db/models/Skill";
import { skillSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const items = await withDb(() =>
      SkillModel.find().sort({ order: 1, createdAt: -1 }).lean(),
    );
    return jsonResponse(items);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to load skills", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = skillSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid skill", 400);
    }

    const count = await withDb(() => SkillModel.countDocuments());
    const item = await withDb(() =>
      SkillModel.create({ ...parsed.data, order: parsed.data.order ?? count }),
    );
    return jsonResponse(item, 201);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to create skill", 500);
  }
}
