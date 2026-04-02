import Link from "next/link";
import { Button } from "@/components/ui/button";

type ContentPageProps = {
  title: string;
  description: string;
  points: string[];
};

export default function ContentPage({ title, description, points }: ContentPageProps) {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-8 md:p-12">
          <h1 className="mb-4 text-4xl font-extrabold text-foreground">{title}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{description}</p>
          <ul className="mb-10 space-y-3 text-foreground/90">
            {points.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/contact">Talk to an Advisor</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
