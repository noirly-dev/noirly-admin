import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

let client: S3Client | null = null;

function getR2Client(): S3Client {
  if (client) return client;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured");
  }

  client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  return client;
}

export function getPublicUrl(key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
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

export async function deleteObject(key: string) {
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
