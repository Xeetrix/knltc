import { redirect } from "next/navigation";

export default function AdminReviewsPage() {
  redirect("/dashboard?tab=store_blog&sub=reviews");
}

