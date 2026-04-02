"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type ContactFormState = {
  name: string;
  phone: string;
  interest: string;
  message: string;
};

const initialForm: ContactFormState = {
  name: "",
  phone: "",
  interest: "",
  message: "",
};

export default function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState<ContactFormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      toast({
        title: "Application submitted",
        description: "Thanks! Our team will contact you soon.",
      });
      setForm(initialForm);
    } catch {
      toast({
        title: "Submission failed",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-8 shadow-sm">
      <h3 className="mb-2 text-xl font-bold text-foreground">Send Us a Message</h3>
      <Input
        placeholder="Your Name"
        required
        value={form.name}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
      />
      <Input
        placeholder="Phone Number"
        required
        value={form.phone}
        onChange={(event) => setForm({ ...form, phone: event.target.value })}
      />
      <Input
        placeholder="Interest (e.g. Study in Japan, Work in Japan)"
        value={form.interest}
        onChange={(event) => setForm({ ...form, interest: event.target.value })}
      />
      <Textarea
        placeholder="Your Message"
        rows={4}
        value={form.message}
        onChange={(event) => setForm({ ...form, message: event.target.value })}
      />
      <Button
        disabled={submitting}
        type="submit"
        className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
      >
        {submitting ? "Submitting..." : "Apply Now"}
      </Button>
    </form>
  );
}
