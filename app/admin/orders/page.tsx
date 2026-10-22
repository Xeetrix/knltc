import { redirect } from "next/navigation";

export default function AdminOrdersPage() {
  redirect("/dashboard?tab=store_blog&sub=orders");
}

