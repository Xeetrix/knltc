"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-md rounded-xl border bg-card p-6">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <form className="mt-5 space-y-4" onSubmit={onSubmit}>
            <input className="w-full rounded-md border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button type="submit" className="w-full rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground">
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
