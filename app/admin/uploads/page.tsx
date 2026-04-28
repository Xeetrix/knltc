export const dynamic = "force-dynamic";

import AdminShell from "@/components/admin/AdminShell";
import UploadManager from "@/components/admin/UploadManager";

export default function AdminUploadsPage() {
  return (
    <AdminShell title="Image Uploads">
      <UploadManager />
    </AdminShell>
  );
}
