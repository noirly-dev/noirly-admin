import { requireAdmin } from "@/lib/content/service";
import { uploadImage } from "@/lib/r2/client";
import { errorResponse, jsonResponse } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const form = await request.formData();
    const file = form.get("file");
    const folderRaw = form.get("folder");
    const folder =
      typeof folderRaw === "string" && folderRaw.trim()
        ? folderRaw.trim()
        : "portfolio";

    if (!(file instanceof File)) {
      return errorResponse("A file is required", 400);
    }

    if (file.size <= 0) {
      return errorResponse("File is empty", 400);
    }

    if (file.size > MAX_BYTES) {
      return errorResponse("Image must be 5MB or smaller", 400);
    }

    const contentType = file.type || "application/octet-stream";
    if (!ALLOWED_TYPES.has(contentType) && !contentType.startsWith("image/")) {
      return errorResponse("Only image files are allowed", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicBaseUrl = new URL(request.url).origin;
    const result = await uploadImage(
      buffer,
      file.name || "upload.png",
      contentType,
      folder,
      publicBaseUrl,
    );

    return jsonResponse({
      key: result.key,
      publicUrl: result.publicUrl,
      storage: result.storage,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[upload]", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to upload image",
      500,
    );
  }
}
