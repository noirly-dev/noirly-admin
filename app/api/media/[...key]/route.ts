import { getMedia } from "@/lib/media/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: segments } = await params;
  const key = segments.map(decodeURIComponent).join("/");
  const media = await getMedia(key);

  if (!media) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(new Uint8Array(media.data), {
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
