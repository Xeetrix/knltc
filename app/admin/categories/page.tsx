import { redirect } from "next/navigation";

export default function AdminCategoriesPage() {
  redirect("/dashboard?tab=store_blog&sub=categories");
}

