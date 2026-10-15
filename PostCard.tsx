import Link from "next/link";
import { MessageCircle } from "lucide-react";
import LikeButton from "./LikeButton";
import { timeAgo } from "@/lib/format";
import { publicUrl } from "@/lib/r2";

export type FeedPost = { id: string; caption: string; imageKey: string; createdAt: Date; user: { name: string }; _count: { likes: number; comments: number }; likes: { userId: string }[] };

export default function PostCard({ p, signedIn }: { p: FeedPost; signedIn: boolean }) {
  return (
    <article className="photo">
      <Link href={`/post/${p.id}`} aria-label={`Open post by ${p.user.name}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={publicUrl(p.imageKey)} alt={p.caption || `Photo by ${p.user.name}`} loading="lazy" style={{ minHeight: 120 }} />
      </Link>
      <div className="veil">
        <p className="text-sm font-medium">{p.user.name} <span className="font-normal text-neutral-300">· {timeAgo(p.createdAt)}</span></p>
        {p.caption && <p className="mt-0.5 line-clamp-2 text-xs text-neutral-200">{p.caption}</p>}
        <div className="mt-1 flex items-center gap-3">
          <LikeButton postId={p.id} signedIn={signedIn} initialCount={p._count.likes} initialLiked={p.likes.length > 0} />
          <Link href={`/post/${p.id}`} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-neutral-100"><MessageCircle className="h-5 w-5" aria-hidden /> {p._count.comments}</Link>
        </div>
      </div>
    </article>
  );
}
