import Link from "next/link";
import { Flame, SlidersHorizontal, FolderHeart, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

const tiles = [
  { c: "from-blue-500/70 to-indigo-700/70", h: "h-40", r: "-4deg", d: "0s" },
  { c: "from-violet-500/70 to-fuchsia-700/60", h: "h-56", r: "3deg", d: "-1.5s" },
  { c: "from-sky-400/70 to-cyan-700/60", h: "h-48", r: "-2deg", d: "-3s" },
  { c: "from-indigo-400/70 to-blue-800/70", h: "h-32", r: "5deg", d: "-4.5s" },
];
const features = [
  { icon: Flame, title: "Trending feed", text: "Like, comment, and see the top photos of the week." },
  { icon: SlidersHorizontal, title: "Built-in editor", text: "Crop, resize, and add filters right in your browser." },
  { icon: FolderHeart, title: "Albums and sharing", text: "Collect your best shots and share them with one link." },
];

export default function Hero() {
  return (
    <section className="mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 px-5 py-14 text-center sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-600/30 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <p className="fade-up mx-auto mb-4 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">Photo sharing for everyone</p>
          <h1 className="fade-up text-4xl font-semibold leading-tight tracking-tight sm:text-6xl" style={{ animationDelay: ".08s" }}>
            Share your photos.<br /><span className="text-gradient">Get discovered.</span>
          </h1>
          <p className="fade-up mx-auto mt-4 max-w-md text-neutral-400" style={{ animationDelay: ".16s" }}>Edit in your browser, post in seconds, and see what is trending today.</p>
          <div className="fade-up mt-7 flex flex-wrap justify-center gap-3" style={{ animationDelay: ".24s" }}>
            <Link href="/register" className="btn">Get started <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <a href="#feed" className="btn-ghost">Browse trending</a>
          </div>
        </div>
        <div aria-hidden className="relative mx-auto mt-12 grid max-w-xl grid-cols-4 items-end gap-3">
          {tiles.map((t, i) => (
            <div key={i} className={`float rounded-2xl bg-gradient-to-br ${t.c} ${t.h} border border-white/10`} style={{ ["--r" as string]: t.r, animationDelay: t.d }} />
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 90}>
            <div className="card glass group h-full p-5 transition duration-300 hover:-translate-y-1 hover:border-accent/50">
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent transition group-hover:scale-110"><f.icon className="h-5 w-5" aria-hidden /></span>
              <h2 className="font-medium">{f.title}</h2>
              <p className="mt-1 text-sm text-neutral-400">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
