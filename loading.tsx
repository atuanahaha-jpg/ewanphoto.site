export default function Loading() {
  const h = ["h-56", "h-72", "h-48", "h-64", "h-52", "h-60"];
  return (
    <div aria-busy="true" aria-label="Loading" className="gap-4 sm:columns-2 lg:columns-3">
      {h.map((x, i) => <div key={i} className={`skeleton mb-4 w-full ${x}`} />)}
    </div>
  );
}
