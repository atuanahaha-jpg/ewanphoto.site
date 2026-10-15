"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/format";

export function NewAlbumForm() {
  const router = useRouter(); const [title, setTitle] = useState(""); const [pub, setPub] = useState(false); const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError("");
    try { const { id } = await post("/api/albums", { title, isPublic: pub }); router.push(`/albums/${id}`); router.refresh(); } catch (err) { setError((err as Error).message); }
  }
  return (
    <form onSubmit={submit} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
      <label htmlFor="t" className="sr-only">Album title</label>
      <input id="t" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={60} required placeholder="New album title" className="input" />
      <label className="flex min-h-[44px] items-center gap-2 whitespace-nowrap text-sm text-neutral-300"><input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} className="h-4 w-4 accent-blue-500" /> Shareable link</label>
      <button className="btn">Create</button>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </form>
  );
}

export function RemoveFromAlbum({ albumId, postId }: { albumId: string; postId: string }) {
  const router = useRouter();
  return <button className="btn-ghost w-full" onClick={async () => { await post(`/api/albums/${albumId}/posts`, { postId, action: "remove" }); router.refresh(); }}>Remove</button>;
}

export function DeleteAlbum({ albumId }: { albumId: string }) {
  const router = useRouter();
  return <button className="btn-ghost text-red-400" onClick={async () => {
    if (!confirm("Delete this album? Photos stay on the site.")) return;
    await fetch(`/api/albums/${albumId}`, { method: "DELETE" }); router.push("/albums"); router.refresh();
  }}>Delete album</button>;
}

export function CopyLink({ slug }: { slug: string }) {
  const [done, setDone] = useState(false);
  return <button className="btn-ghost" onClick={async () => { await navigator.clipboard.writeText(`${location.origin}/s/${slug}`); setDone(true); setTimeout(() => setDone(false), 2000); }}>{done ? "Copied!" : "Copy share link"}</button>;
}
