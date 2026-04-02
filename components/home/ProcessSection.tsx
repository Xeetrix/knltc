"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "1", title: "Consultation", desc: "Free consultation to understand your goals and eligibility." },
  { num: "2", title: "Eligibility Check", desc: "We assess your profile and recommend the best path." },
  { num: "3", title: "Training & Prep", desc: "Language training, interview prep, and skill building." },
  { num: "4", title: "Application & Visa", desc: "We handle documents, applications, and visa processing." },
  { num: "5", title: "Pre-Departure & Arrival", desc: "Final briefing, travel support, and Japan settlement." },
];

const ProcessSection = () => (
  <section className="section-padding">
    <div className="container-narrow">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Your 5-Step Journey to Japan</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A simple, transparent process from start to finish.
        </p>
      </div>

      <div className="relative">
        {/* Connecting line - desktop */}
        <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-border" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="text-center relative"
            >
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-extrabold relative z-10 shadow-lg">
                {step.num}
              </div>
              <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessSection;
