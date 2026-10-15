import Link from "next/link";
import { getUser } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const user = await getUser();
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 glass">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4" aria-label="Main">
        <Link href="/" className="text-lg font-semibold tracking-tight transition hover:opacity-80">Photo<span className="text-accent">shop</span></Link>
        <div className="flex items-center gap-2">
          {user ? (<>
            <Link href="/albums" className="btn-ghost hidden sm:inline-flex">Albums</Link>
            <Link href="/upload" className="btn">Upload</Link>
            <LogoutButton />
          </>) : (<>
            <Link href="/login" className="btn-ghost">Sign in</Link>
            <Link href="/register" className="btn hidden sm:inline-flex">Sign up</Link>
          </>)}
        </div>
      </nav>
    </header>
  );
}
