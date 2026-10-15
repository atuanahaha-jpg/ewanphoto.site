import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const ALLOWED_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_BYTES = 10 * 1024 * 1024;

const client = () => new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
});

export async function presignUpload(key: string, contentType: string) {
  return getSignedUrl(client(), new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, ContentType: contentType }), { expiresIn: 120 });
}
export const publicUrl = (key: string) => `${process.env.R2_PUBLIC_URL}/${key}`;
