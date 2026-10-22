"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { CrmLead, LeadStatus } from "@/lib/cms";

const statuses: LeadStatus[] = ["new", "contacted", "interested", "converted", "lost"];

export default function CrmManager({ initialLeads }: { initialLeads: CrmLead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const updateLead = async (id: string, payload: { status?: LeadStatus; notes?: string }) => {
    const res = await fetch("/api/admin/crm", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed to update lead");
    setLeads((prev) => prev.map((lead) => (lead.id === id ? data.lead : lead)));
  };

  const createManualLead = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/admin/crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email: email || null, source: "manual admin entry" }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Failed to create lead");
    setLeads((prev) => [data.lead, ...prev]);
    setName("");
    setPhone("");
    setEmail("");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={createManualLead} className="grid gap-2.5 rounded-2xl border border-stone-200 bg-[#fcfaf7] p-4 md:grid-cols-4">
        <input required className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium" placeholder="প্রার্থীর নাম (Name)" value={name} onChange={(e) => setName(e.target.value)} />
        <input required className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium" placeholder="ফোন নম্বর (Phone)" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-medium" placeholder="ইমেইল (Email - ঐচ্ছিক)" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="rounded-xl bg-[#133e29] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition">নতুন ডাটাবেজ লিড যুক্ত করুন</button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {leads.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center text-xs text-slate-500">
          বর্তমানে Supabase `crm_leads` টেবিলে কোনো ওয়েবসাইট বা চেকআউট লিড নেই।
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2">
                <p className="font-extrabold text-sm text-slate-900">{lead.name} • <span className="font-mono text-emerald-700">{lead.phone}</span></p>
                <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">{lead.source}</span>
              </div>
              {lead.interest || lead.message ? (
                <p className="text-xs text-slate-600 mt-1">{lead.interest ? `${lead.interest} — ` : ""}{lead.message}</p>
              ) : null}
              <div className="mt-3 grid gap-2 sm:grid-cols-[140px_1fr]">
                <select className="rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1.5 text-xs font-bold text-slate-800" value={lead.status} onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}>
                  {statuses.map((status) => <option key={status} value={status}>{status.toUpperCase()}</option>)}
                </select>
                <input
                  className="rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs"
                  defaultValue={lead.notes ?? ""}
                  placeholder="কাউন্সেলর ফলো-আপ নোট লিখুন..."
                  onBlur={(e) => updateLead(lead.id, { notes: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
