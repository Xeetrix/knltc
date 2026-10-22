import { redirect } from "next/navigation";

export default function AdminUploadsPage() {
  redirect("/dashboard?tab=store_blog&sub=uploads");
}

