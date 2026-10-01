import { Suspense } from "react";
import type { Metadata } from "next";
import RbacPortal from "@/components/portal/RbacPortal";

export const metadata: Metadata = {
  title: "KNLTC RBAC Portal | Japanese Course & Campus Management",
  description:
    "Four-Tier Role-Based Access Control portal for KNLTC: Super Admin, Branch Admin, Teacher, and Student workspaces.",
};

export default function PortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 p-8 flex items-center justify-center text-sm text-slate-500">
          Loading RBAC Portal...
        </div>
      }
    >
      <RbacPortal />
    </Suspense>
  );
}
