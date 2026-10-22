import { redirect } from "next/navigation";

export default function AdminBlogPage() {
  redirect("/dashboard?tab=store_blog&sub=blog");
}

