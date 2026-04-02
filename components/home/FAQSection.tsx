"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How much Japanese language is required?",
    a: "For most opportunities, JLPT N4 or N3 is required. KNLTC offers structured courses to help you reach the required level before application.",
  },
  {
    q: "Can I study and work part-time in Japan?",
    a: "Yes! Students in Japan can legally work up to 28 hours per week. We'll guide you on how to manage your schedule effectively.",
  },
  {
    q: "What services does KNLTC provide?",
    a: "We provide Japanese language training, job preparation, interview coaching, visa processing, pre-departure guidance, and Japan arrival support — all under one roof.",
  },
  {
    q: "How do I start my Japan journey?",
    a: "Simply contact us via WhatsApp or fill out our application form. We'll schedule a free consultation to assess your goals and eligibility.",
  },
  {
    q: "How can I contact KNLTC?",
    a: "You can reach us via WhatsApp, phone, email, or by visiting our Dhaka office. All contact details are available on this page.",
  },
];

const FAQSection = () => (
  <section className="section-padding bg-surface">
    <div className="container-narrow max-w-3xl">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Everything you need to know before starting your Japan journey.</p>
      </div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="bg-card border rounded-lg px-6 data-[state=open]:shadow-sm"
          >
            <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
