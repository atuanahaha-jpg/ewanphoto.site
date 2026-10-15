import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await db.post.findMany({ select: { id: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 5000 });
  return [{ url: site, changeFrequency: "hourly" }, ...posts.map((p) => ({ url: `${site}/post/${p.id}`, lastModified: p.createdAt }))];
}
