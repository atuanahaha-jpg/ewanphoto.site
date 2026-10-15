"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/format";

const RATIOS: Record<string, number | null> = { Original: null, "1:1": 1, "4:5": 4 / 5, "16:9": 16 / 9 };
const MAX_SIDES = [1080, 1600, 2048];

export default function Uploader() {
  const router = useRouter();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [bmp, setBmp] = useState<ImageBitmap | null>(null);
  const [ratio, setRatio] = useState("Original");
  const [maxSide, setMaxSide] = useState(1600);
  const [f, setF] = useState({ brightness: 100, contrast: 100, grayscale: 0, blur: 0 });
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return setError("Use a JPEG, PNG or WebP image");
    if (file.size > 25 * 1024 * 1024) return setError("File is too large (max 25 MB before editing)");
    setError(""); setBmp(await createImageBitmap(file));
  }

  function render(target: HTMLCanvasElement) {
    if (!bmp) return;
    const r = RATIOS[ratio];
    let sw = bmp.width, sh = bmp.height, sx = 0, sy = 0;
    if (r) { if (sw / sh > r) { sw = sh * r; sx = (bmp.width - sw) / 2; } else { sh = sw / r; sy = (bmp.height - sh) / 2; } }
    const scale = Math.min(1, maxSide / Math.max(sw, sh));
    target.width = Math.round(sw * scale); target.height = Math.round(sh * scale);
    const ctx = target.getContext("2d")!;
    ctx.filter = `brightness(${f.brightness}%) contrast(${f.contrast}%) grayscale(${f.grayscale}%) blur(${f.blur}px)`;
    ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, target.width, target.height);
  }
  useEffect(() => { if (canvas.current) render(canvas.current); });

  async function publish() {
    if (!bmp) return; setBusy(true); setError("");
    try {
      const out = document.createElement("canvas"); render(out);
      const blob: Blob = await new Promise((res, rej) => out.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), "image/webp", 0.88));
      const { key, uploadUrl } = await post("/api/upload/presign", { contentType: "image/webp", size: blob.size });
      const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": "image/webp" }, body: blob });
      if (!put.ok) throw new Error("Upload to storage failed");
      const { id } = await post("/api/posts", { imageKey: key, caption });
      router.push(`/post/${id}`); router.refresh();
    } catch (e) { setError((e as Error).message); setBusy(false); }
  }

  const slider = (k: keyof typeof f, label: string, min: number, max: number) => (
    <div key={k}>
      <label htmlFor={k} className="flex justify-between text-sm text-neutral-400"><span>{label}</span><span>{f[k]}</span></label>
      <input id={k} type="range" min={min} max={max} value={f[k]} onChange={(e) => setF({ ...f, [k]: +e.target.value })} className="h-11 w-full accent-blue-500" />
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div className="card flex min-h-[280px] items-center justify-center overflow-hidden p-2">
        {bmp ? <canvas ref={canvas} className="max-h-[70vh] max-w-full" aria-label="Edited image preview" /> : (
          <label htmlFor="file" className="flex min-h-[260px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 text-neutral-400 hover:border-accent">
            <span className="text-sm">Tap to choose a photo</span><span className="text-xs text-neutral-500">JPEG, PNG or WebP</span>
          </label>
        )}
        <input id="file" type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} className="sr-only" />
      </div>
      <div className="card space-y-4 p-4">
        {bmp && <label htmlFor="file" className="btn-ghost w-full cursor-pointer">Change photo</label>}
        <fieldset disabled={!bmp} className="space-y-3 disabled:opacity-50">
          <legend className="mb-2 text-sm font-medium">Crop</legend>
          <div className="flex flex-wrap gap-2">{Object.keys(RATIOS).map((k) => <button key={k} type="button" onClick={() => setRatio(k)} aria-pressed={ratio === k} className={ratio === k ? "btn" : "btn-ghost"}>{k}</button>)}</div>
          <p className="pt-1 text-sm font-medium">Resize (longest side)</p>
          <div className="flex gap-2">{MAX_SIDES.map((s) => <button key={s} type="button" onClick={() => setMaxSide(s)} aria-pressed={maxSide === s} className={maxSide === s ? "btn" : "btn-ghost"}>{s}px</button>)}</div>
          <p className="pt-1 text-sm font-medium">Filters</p>
          {slider("brightness", "Brightness", 50, 150)}{slider("contrast", "Contrast", 50, 150)}{slider("grayscale", "Black & white", 0, 100)}{slider("blur", "Blur", 0, 8)}
          <button type="button" className="btn-ghost w-full" onClick={() => { setF({ brightness: 100, contrast: 100, grayscale: 0, blur: 0 }); setRatio("Original"); }}>Reset edits</button>
        </fieldset>
        <div>
          <label htmlFor="caption" className="mb-1 block text-sm text-neutral-400">Caption</label>
          <textarea id="caption" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={500} rows={3} className="input py-2" placeholder="Say something about this photo" />
        </div>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
        <button className="btn w-full" disabled={!bmp || busy} onClick={publish}>{busy ? "Publishing…" : "Publish"}</button>
      </div>
    </div>
  );
}
