"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Recent Applicant",
    role: "Work Program Candidate",
    quote:
      "The guidance process was clear from day one. I always knew what documents to prepare and what steps came next.",
    rating: 5,
  },
  {
    name: "Language Student",
    role: "JLPT Learner",
    quote:
      "Classes and consultation were practical and supportive. The team helped me stay confident with my Japan study plan.",
    rating: 5,
  },
  {
    name: "Career Candidate",
    role: "Interview Preparation",
    quote:
      "I appreciated the interview coaching and communication support. It made me better prepared for employer discussions.",
    rating: 5,
  },
];

const TestimonialsSection = () => (
  <section id="testimonials" className="section-padding">
    <div className="container-narrow">
      <div className="mb-14 text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-foreground md:text-4xl">Client Feedback</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Here is how learners and applicants describe their experience with KNLTC.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name + i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="rounded-lg border bg-card p-8 transition-shadow hover:shadow-md"
          >
            <div className="mb-4 flex gap-1">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="mb-6 italic leading-relaxed text-foreground/80">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {t.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
