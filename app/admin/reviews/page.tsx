import AdminShell from "@/components/admin/AdminShell";
import ReviewManager from "@/components/admin/ReviewManager";
import { getPendingAdminReviews } from "@/lib/cms";

export default async function AdminReviewsPage() {
  const reviews = await getPendingAdminReviews();

  return (
    <AdminShell title="Pending Product Reviews">
      <ReviewManager initialReviews={reviews} />
    </AdminShell>
  );
}
