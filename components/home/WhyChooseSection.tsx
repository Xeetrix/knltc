"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const points = [
  { title: "Step-by-Step Guidance", desc: "We walk you through every stage — no confusion, no shortcuts." },
  { title: "Clear & Transparent Process", desc: "You'll always know where you stand and what comes next." },
  { title: "Language + Career Support", desc: "We prepare you with both the language and professional skills." },
  { title: "Scam-Aware Consultation", desc: "We educate you on common scams so you stay protected." },
  { title: "Honest Communication", desc: "No fake promises. Only realistic expectations and practical guidance." },
  { title: "End-to-End Support", desc: "From first call to Japan arrival — we're with you the entire way." },
];

const WhyChooseSection = () => (
  <section id="about" className="section-padding bg-surface">
    <div className="container-narrow">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Why Choose KNLTC?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We're not just an agency — we're your trusted partner for a safe and successful journey to Japan.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {points.map((pt, i) => (
          <motion.div
            key={pt.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex gap-4"
          >
            <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-foreground mb-1">{pt.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{pt.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseSection;
