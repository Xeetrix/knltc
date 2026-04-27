import AdminShell from "@/components/admin/AdminShell";
import CrmManager from "@/components/admin/CrmManager";
import { getAllCrmLeads } from "@/lib/cms";

export default async function AdminCrmPage() {
  const leads = await getAllCrmLeads();

  return (
    <AdminShell title="CRM Leads">
      <CrmManager initialLeads={leads} />
    </AdminShell>
  );
}
