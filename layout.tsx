import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Photoshop – Share trending photos", template: "%s · Photoshop" },
  description: "Upload, edit and share photos. Discover what's trending.",
  openGraph: { siteName: "Photoshop", type: "website" },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <footer className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">© {new Date().getFullYear()} Photoshop</footer>
      </body>
    </html>
  );
}
