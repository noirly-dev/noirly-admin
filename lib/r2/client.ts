import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";

let client: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim() &&
      process.env.R2_PUBLIC_URL?.trim(),
  );
}

function getR2Client(): S3Client {
  if (client) return client;

  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured");
  }

  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    // AWS SDK v3.729+ signs CRC32 checksums into presigned URLs; browsers
    // don't send them, which breaks R2 PUTs. Only checksum when required.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });

  return client;
}

export function getPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "").trim();
  if (!base) {
    throw new Error("R2_PUBLIC_URL is required for public asset URLs");
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

/** Upload an image to R2 when configured, otherwise to local public/uploads. */
export async function uploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string,
  folder = "portfolio",
  publicBaseUrl?: string,
): Promise<{ key: string; publicUrl: string; storage: "r2" | "local" }> {
  if (isR2Configured()) {
    const result = await uploadBuffer(buffer, filename, contentType, folder);
    return { ...result, storage: "r2" };
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "R2 credentials are not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL.",
    );
  }

  if (!publicBaseUrl) {
    throw new Error("Missing request origin for local upload URL");
  }

  const result = await uploadLocal(buffer, filename, folder, publicBaseUrl);
  return { ...result, storage: "local" };
}

export async function deleteObject(key: string) {
  if (!isR2Configured()) return;

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
