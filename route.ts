import { db } from "@/lib/db";
import { guarded, json, fail } from "@/lib/api";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return guarded(req, null, async ({ user }) => {
    if (!(await db.post.findUnique({ where: { id: params.id }, select: { id: true } }))) return fail("Not found", 404);
    const where = { userId_postId: { userId: user.id, postId: params.id } };
    const existing = await db.like.findUnique({ where });
    if (existing) await db.like.delete({ where }); else await db.like.create({ data: { userId: user.id, postId: params.id } });
    const count = await db.like.count({ where: { postId: params.id } });
    return json({ liked: !existing, count });
  });
}
