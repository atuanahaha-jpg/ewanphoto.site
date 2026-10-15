"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/format";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try { await post(`/api/auth/${mode}`, f); router.push("/"); router.refresh(); }
    catch (err) { setError((err as Error).message); setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="card glass fade-up mx-auto mt-10 w-full max-w-sm space-y-4 p-6">
      <h1 className="text-xl font-semibold">{mode === "login" ? "Sign in" : "Create account"}</h1>
      {mode === "register" && <div><label htmlFor="name" className="mb-1 block text-sm text-neutral-400">Name</label><input id="name" name="name" required minLength={2} maxLength={40} className="input" autoComplete="name" /></div>}
      <div><label htmlFor="email" className="mb-1 block text-sm text-neutral-400">Email</label><input id="email" name="email" type="email" required className="input" autoComplete="email" /></div>
      <div><label htmlFor="password" className="mb-1 block text-sm text-neutral-400">Password</label><input id="password" name="password" type="password" required minLength={mode === "register" ? 8 : 1} className="input" autoComplete={mode === "login" ? "current-password" : "new-password"} /></div>
      {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      <button className="btn w-full" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}</button>
    </form>
  );
}
