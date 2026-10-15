import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { getUser } from "./auth";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (message: string, status = 400) => json({ error: message }, status);

// CSRF defence: mutating requests must come from our own origin.
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (!origin || !host) return false;
  try { return new URL(origin).host === host; } catch { return false; }
}

const hits = new Map<string, { n: number; reset: number }>();
// In-memory limiter: fine for one instance. Use Redis/Upstash when scaling out.
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { n: 1, reset: now + windowMs }); return true; }
  h.n += 1;
  return h.n <= max;
}
export const ip = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

type Ctx = { user: NonNullable<Awaited<ReturnType<typeof getUser>>>; req: Request };
export async function guarded<T>(req: Request, schema: ZodSchema<T> | null, fn: (c: Ctx, body: T) => Promise<Response>, auth = true) {
  if (!sameOrigin(req)) return fail("Bad origin", 403);
  const user = await getUser();
  if (auth && !user) return fail("Please sign in", 401);
  let body = undefined as T;
  if (schema) {
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input", 422);
    body = parsed.data;
  }
  try { return await fn({ user: user!, req }, body); }
  catch (e) { console.error("api error", e instanceof Error ? e.message : "unknown"); return fail("Something went wrong", 500); }
}
