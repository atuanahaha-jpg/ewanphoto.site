import Link from "next/link";
export default function NotFound() {
  return <div className="card mx-auto mt-10 max-w-md p-8 text-center"><p className="text-lg font-medium">Page not found</p><Link href="/" className="btn mt-4">Back to feed</Link></div>;
}
