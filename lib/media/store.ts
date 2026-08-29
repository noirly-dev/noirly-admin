import { withDb } from "@/lib/db/mongodb";
import { Media } from "@/lib/db/models/Media";

export async function saveMedia(
  key: string,
  contentType: string,
  data: Buffer,
): Promise<void> {
  await withDb(async () => {
    await Media.findOneAndUpdate(
      { key },
      { key, contentType, data },
      { upsert: true },
    );
  });
}

export async function getMedia(
  key: string,
): Promise<{ contentType: string; data: Buffer } | null> {
  return withDb(async () => {
    const doc = await Media.findOne({ key }).lean();
    if (!doc?.data) return null;
    return {
      contentType: doc.contentType,
      data: Buffer.from(doc.data),
    };
  });
}
