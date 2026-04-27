import AdminShell from "@/components/admin/AdminShell";
import ReviewManager from "@/components/admin/ReviewManager";
import { getAllAdminReviews } from "@/lib/cms";

export default async function AdminReviewsPage() {
  const reviews = await getAllAdminReviews();

  return (
    <AdminShell title="Manage Product Reviews">
      <ReviewManager initialReviews={reviews} />
    </AdminShell>
  );
}
