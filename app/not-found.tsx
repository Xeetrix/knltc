import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-padding">
      <div className="container-narrow text-center">
        <h1 className="mb-3 text-4xl font-extrabold">Page Not Found</h1>
        <p className="mb-6 text-muted-foreground">The page you are looking for does not exist.</p>
        <Link href="/" className="font-semibold text-primary hover:underline">Return Home</Link>
      </div>
    </section>
  );
}
