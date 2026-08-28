import { requireAdmin } from "@/lib/content/service";
import { withDb } from "@/lib/db/mongodb";
import { ProjectModel } from "@/lib/db/models/Project";
import { projectSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const project = await withDb(() => ProjectModel.findById(id).lean());
    if (!project) return errorResponse("Project not found", 404);
    return jsonResponse(project);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to load project", 500);
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = projectSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid project", 400);
    }

    const project = await withDb(() =>
      ProjectModel.findByIdAndUpdate(id, { $set: parsed.data }, { new: true }).lean(),
    );
    if (!project) return errorResponse("Project not found", 404);
    return jsonResponse(project);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to update project", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    await requireAdmin();
    const { id } = await params;
    const project = await withDb(() => ProjectModel.findByIdAndDelete(id).lean());
    if (!project) return errorResponse("Project not found", 404);
    return jsonResponse({ ok: true });
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to delete project", 500);
  }
}
