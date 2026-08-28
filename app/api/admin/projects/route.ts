import { requireAdmin } from "@/lib/content/service";
import { withDb } from "@/lib/db/mongodb";
import { ProjectModel } from "@/lib/db/models/Project";
import { projectSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const projects = await withDb(() =>
      ProjectModel.find().sort({ order: 1, createdAt: -1 }).lean(),
    );
    return jsonResponse(projects);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to load projects", 500);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid project", 400);
    }

    const count = await withDb(() => ProjectModel.countDocuments());
    const project = await withDb(() =>
      ProjectModel.create({ ...parsed.data, order: parsed.data.order ?? count }),
    );

    return jsonResponse(project, 201);
  } catch (error) {
    if (error instanceof Response) return error;
    return errorResponse("Failed to create project", 500);
  }
}
