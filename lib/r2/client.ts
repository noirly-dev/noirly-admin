import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { saveMedia } from "@/lib/media/store";

let client: S3Client | null = null;

function resolveR2AccountId(): string | undefined {
  const explicit = process.env.R2_ACCOUNT_ID?.trim();
  if (explicit) return explicit;

  const publicUrl = process.env.R2_PUBLIC_URL?.trim();
  if (!publicUrl) return undefined;

  try {
    const match = new URL(publicUrl).hostname.match(
      /^([a-f0-9]{32})\.r2\.cloudflarestorage\.com$/i,
    );
    return match?.[1];
  } catch {
    return undefined;
  }
}

/** True when the server can write objects to R2 (needs API keys + bucket). */
export function canWriteToR2(): boolean {
  return Boolean(
    resolveR2AccountId() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim(),
  );
}

/** @deprecated Use canWriteToR2() */
export function isR2Configured(): boolean {
  return canWriteToR2();
}

function getR2Client(): S3Client {
  if (client) return client;

  const accountId = resolveR2AccountId();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 write credentials are not configured");
  }

  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  return client;
}

export function getPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "").trim();
  if (!base) {
    throw new Error("R2_PUBLIC_URL is required for R2 asset URLs");
  }
  return `${base}/${key}`;
}

export function buildObjectKey(filename: string, folder = "portfolio"): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const ext = safe.includes(".") ? safe.slice(safe.lastIndexOf(".")) : "";
  const base = safe.replace(ext, "") || "asset";
  return `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}-${base}${ext}`;
}

export async function createUploadUrl(
  key: string,
  contentType: string,
  expiresIn = 300,
) {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is required");

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(getR2Client(), command, { expiresIn });
  return { uploadUrl, key, publicUrl: getPublicUrl(key) };
}

export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder = "portfolio",
): Promise<{ key: string; publicUrl: string }> {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is required");

  const key = buildObjectKey(filename, folder);
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return { key, publicUrl: getPublicUrl(key) };
}

async function uploadLocal(
  buffer: Buffer,
  filename: string,
  folder: string,
  publicBaseUrl: string,
): Promise<{ key: string; publicUrl: string }> {
  const key = buildObjectKey(filename, folder);
  const filePath = join(process.cwd(), "public", "uploads", key);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  const base = publicBaseUrl.replace(/\/$/, "");
  return { key, publicUrl: `${base}/uploads/${key}` };
}

function mediaPublicUrl(publicBaseUrl: string, key: string): string {
  const base = publicBaseUrl.replace(/\/$/, "");
  return `${base}/api/media/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

/** Upload to R2 when API keys exist; otherwise MongoDB (or local files in dev). */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder = "portfolio",
  publicBaseUrl?: string,
): Promise<{ key: string; publicUrl: string; storage: "r2" | "local" | "mongo" }> {
  if (canWriteToR2()) {
    const result = await uploadBuffer(buffer, filename, contentType, folder);
    return { ...result, storage: "r2" };
  }

  const key = buildObjectKey(filename, folder);

  if (process.env.MONGODB_URI?.trim()) {
    if (!publicBaseUrl) {
      throw new Error("Missing request origin for media URL");
    }
    await saveMedia(key, contentType, buffer);
    return {
      key,
      publicUrl: mediaPublicUrl(publicBaseUrl, key),
      storage: "mongo",
    };
  }

  if (publicBaseUrl && process.env.NODE_ENV !== "production") {
    const result = await uploadLocal(buffer, filename, folder, publicBaseUrl);
    return { ...result, storage: "local" };
  }

  throw new Error("Upload storage is unavailable");
}

export async function deleteObject(key: string) {
  if (!canWriteToR2()) return;

  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is required");

  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: key }),
  );
}

export function extractKeyFromUrl(url: string): string | null {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base || !url.startsWith(base)) return null;
  return url.slice(base.length + 1);
}
