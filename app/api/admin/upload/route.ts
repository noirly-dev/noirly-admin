import { requireAdmin } from "@/lib/content/service";
import { buildObjectKey, createUploadUrl } from "@/lib/r2/client";
import { uploadRequestSchema } from "@/lib/validation/schemas";
import { errorResponse, jsonResponse } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = uploadRequestSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid upload request", 400);
    }

    const key = buildObjectKey(parsed.data.filename, parsed.data.folder ?? "portfolio");
    const result = await createUploadUrl(key, parsed.data.contentType);
    return jsonResponse(result);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[upload]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to create upload URL",
      500,
    );
  }
}
