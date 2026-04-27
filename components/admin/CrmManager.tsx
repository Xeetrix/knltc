"use client";

import { useState, type FormEvent } from "react";
import type { CrmLead, LeadStatus } from "@/lib/cms";

const statuses: LeadStatus[] = ["new", "contacted", "interested", "converted", "lost"];

export default function CrmManager({ initialLeads }: { initialLeads: CrmLead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

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
    <div className="space-y-5">
      <form onSubmit={createManualLead} className="grid gap-2 rounded-xl border bg-card p-4 md:grid-cols-4">
        <input required className="rounded-md border px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input required className="rounded-md border px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input className="rounded-md border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Add lead</button>
      </form>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {leads.map((lead) => (
        <div key={lead.id} className="rounded-xl border bg-card p-4">
          <p className="font-semibold">{lead.name} • {lead.phone}</p>
          <p className="text-sm text-muted-foreground">{lead.source} {lead.interest ? `• ${lead.interest}` : ""}</p>
          <div className="mt-3 grid gap-2 md:grid-cols-[160px_1fr_auto]">
            <select className="rounded-md border px-2 py-1 text-sm" value={lead.status} onChange={(e) => updateLead(lead.id, { status: e.target.value as LeadStatus })}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <input
              className="rounded-md border px-2 py-1 text-sm"
              defaultValue={lead.notes ?? ""}
              placeholder="Lead notes"
              onBlur={(e) => updateLead(lead.id, { notes: e.target.value })}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
