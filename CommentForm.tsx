"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/format";
export default function CommentForm({ postId }: { postId: string }) {
  const router = useRouter(); const [body, setBody] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { await post(`/api/posts/${postId}/comments`, { body }); setBody(""); router.refresh(); } catch (err) { setError((err as Error).message); }
    setBusy(false);
  }
  return (
    <form onSubmit={submit} className="flex gap-2">
      <label htmlFor="c" className="sr-only">Add a comment</label>
      <input id="c" value={body} onChange={(e) => setBody(e.target.value)} maxLength={500} placeholder="Add a comment" className="input" />
      <button className="btn" disabled={busy || !body.trim()}>Post</button>
      {error && <p role="alert" className="sr-only">{error}</p>}
    </form>
  );
}
