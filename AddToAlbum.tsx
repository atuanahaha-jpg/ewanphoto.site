"use client";
import { useState } from "react";
import { post } from "@/lib/format";
export default function AddToAlbum({ postId, albums }: { postId: string; albums: { id: string; title: string }[] }) {
  const [msg, setMsg] = useState("");
  if (albums.length === 0) return <p className="text-sm text-neutral-500">Create an album first to save this photo.</p>;
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="alb" className="sr-only">Save to album</label>
      <select id="alb" className="input" defaultValue="" onChange={async (e) => {
        if (!e.target.value) return;
        try { await post(`/api/albums/${e.target.value}/posts`, { postId, action: "add" }); setMsg("Saved"); } catch (err) { setMsg((err as Error).message); }
        e.target.value = "";
      }}>
        <option value="">Save to album…</option>
        {albums.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
      </select>
      <span role="status" className="text-sm text-neutral-400">{msg}</span>
    </div>
  );
}
