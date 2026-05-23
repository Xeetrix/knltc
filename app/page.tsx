import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WhatsAppFAB from "@/components/home/WhatsAppFAB";

export const metadata: Metadata = {
  title: "Japan & Global Education Consultancy",
  description: "Japanese Language Training, SSW/TITP Support, Student Visa, Skill Development & International Education Guidance.",
};

const coreServices = ["Japanese Language Program", "Skill Training", "Student & Job Visa Support", "Interview Preparation", "Documentation Support", "Japanese Learning Resources", "After Arrival Support"];

export default function HomePage() {
  return <>
    <section className="section-padding bg-gradient-to-b from-slate-900 to-slate-700 text-white"><div className="container-narrow"><h1 className="text-4xl font-bold md:text-5xl">Japan & Global Education Consultancy</h1><p className="mt-4 max-w-3xl text-white/85">Japanese Language Training, SSW/TITP Support, Student Visa, Skill Development & International Education Guidance.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild><Link href="/contact">Free Consultation</Link></Button><Button asChild variant="outline"><a href="https://wa.me/8801313292295" target="_blank" rel="noopener noreferrer">WhatsApp</a></Button><Button asChild variant="secondary"><Link href="/services">Explore Services</Link></Button></div></div></section>
    <section className="section-padding"><div className="container-narrow grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle>Work & Career in Japan</CardTitle></CardHeader><CardContent><Button asChild><Link href="/japan-career">Explore Pathway</Link></Button></CardContent></Card><Card><CardHeader><CardTitle>Study Abroad</CardTitle></CardHeader><CardContent><Button asChild><Link href="/study-abroad">Explore Pathway</Link></Button></CardContent></Card></div></section>
    <section className="section-padding pt-0"><div className="container-narrow"><h2 className="text-3xl font-bold">Core Services</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{coreServices.map((item)=><Card key={item}><CardContent className="p-5 font-medium">{item}</CardContent></Card>)}</div></div></section>
    <section className="section-padding pt-0"><div className="container-narrow"><h2 className="text-3xl font-bold">Featured Programs</h2><div className="mt-5 grid gap-4 md:grid-cols-4">{[["SSW Visa","/ssw-visa"],["TITP Program","/japan-career"],["Study in Malaysia","/study-in-malaysia"],["Study in China","/study-in-china"]].map(([n,h])=><Card key={n}><CardHeader><CardTitle>{n}</CardTitle></CardHeader><CardContent><Button asChild variant="outline"><Link href={h}>{n}</Link></Button></CardContent></Card>)}</div></div></section>
    <section className="section-padding pt-0"><div className="container-narrow rounded-2xl border bg-white p-6"><h2 className="text-3xl font-bold">Japanese Learning Resources</h2><p className="mt-2 text-muted-foreground">Explore books and study tools from our existing store ecosystem.</p><Button asChild className="mt-4"><Link href="/store">Visit Store</Link></Button></div></section>
    <section className="section-padding pt-0"><div className="container-narrow rounded-2xl border bg-white p-6"><h2 className="text-3xl font-bold">Why KNLTC</h2><ul className="mt-3 space-y-2 text-muted-foreground"><li>Language + Skill + Visa ecosystem</li><li>End-to-end support</li><li>After-arrival support</li><li>Japan-focused expertise</li></ul></div></section>
    <WhatsAppFAB />
  </>;
}
