import { redirect } from "next/navigation";

export default function AdminCrmPage() {
  redirect("/dashboard?tab=crm");
}

