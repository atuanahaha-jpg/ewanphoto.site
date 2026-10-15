"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { post } from "@/lib/format";

export default function LikeButton({ postId, initialLiked, initialCount, signedIn }: { postId: string; initialLiked: boolean; initialCount: number; signedIn: boolean }) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked); const [count, setCount] = useState(initialCount);
  async function toggle() {
    if (!signedIn) return router.push("/login");
    setLiked(!liked); setCount(count + (liked ? -1 : 1));
    try { const r = await post(`/api/posts/${postId}/like`); setLiked(r.liked); setCount(r.count); }
    catch { setLiked(liked); setCount(count); }
  }
  return (
    <button onClick={toggle} aria-pressed={liked} aria-label={liked ? "Unlike" : "Like"} className="inline-flex min-h-[44px] items-center gap-1.5 px-1 text-sm text-neutral-100 hover:text-white">
      <Heart className={`h-5 w-5 transition ${liked ? "heart-pop fill-accent text-accent" : ""}`} /> {count}
    </button>
  );
}
