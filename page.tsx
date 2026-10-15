import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import Uploader from "@/components/Uploader";
export const metadata = { title: "Upload", robots: { index: false } };
export default async function Page() {
  if (!(await getUser())) redirect("/login");
  return (<><h1 className="mb-4 text-xl font-semibold">Upload &amp; edit</h1><Uploader /></>);
}
