"use client";

import { motion } from "framer-motion";
import {
  Languages,
  Briefcase,
  Mic,
  Building2,
  FileCheck,
  Plane,
  MapPin,
} from "lucide-react";

const services = [
  { icon: Languages, title: "Japanese Language Training", desc: "Structured JLPT courses from N5 to N1 with expert instructors." },
  { icon: Briefcase, title: "Japan Job Preparation", desc: "Resume building, skill assessment, and career counseling for Japan." },
  { icon: Mic, title: "Interview Preparation", desc: "Mock interviews, cultural coaching, and confidence building." },
  { icon: Building2, title: "Job Placement Support", desc: "Employer-facing application support and role matching guidance." },
  { icon: FileCheck, title: "Visa Processing Support", desc: "Complete documentation and application assistance." },
  { icon: Plane, title: "Pre-Departure Guidance", desc: "Accommodation, travel, insurance, and cultural orientation." },
  { icon: MapPin, title: "Japan Arrival Support", desc: "Arrival planning, orientation, and ongoing support guidance." },
];

const ServicesSection = () => (
  <section id="services" className="section-padding">
    <div className="container-narrow">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Our Services</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          End-to-end support from your first consultation to your first day in Japan.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {services.map((svc, i) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <svc.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">{svc.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
