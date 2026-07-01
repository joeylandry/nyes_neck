import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About | NYES NECK",
  description: "The story and community purpose behind NYES NECK.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader title="About" eyebrow="OUR STORY" />
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-20">
        <section className="grid gap-8 border-b border-black/10 pb-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pb-20">
          <h2 className="font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.045em] md:text-5xl">
            Rooted on the Upper Cape
          </h2>
          <p className="text-lg leading-8 text-black/70 md:text-xl md:leading-9">
            NYES NECK is a premium Cape Cod lifestyle apparel brand rooted in Nyes Neck, North Falmouth, and the communities of the Upper Cape—from Old Silver and New Silver to Seascape, Megansett, and Wild Harbor.
          </p>
        </section>

        <section className="grid gap-8 pt-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pt-20">
          <h2 className="font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.045em] md:text-5xl">
            Built to give back
          </h2>
          <div className="space-y-7 text-lg leading-8 text-black/70">
            <p>
              Years before this brand took shape, its founder spent nine years as a child raising funds for Make-A-Wish by selling Nyes Neck apparel. That experience remains part of the idea behind NYES NECK: create enduring coastal goods, strengthen community, and build a business with charitable purpose.
            </p>
            <aside className="rounded-[30px] border border-black/10 bg-[#a8c2bc]/55 p-7 text-[#183247] shadow-sm md:p-9">
              <p className="font-semibold leading-8">
                As NYES NECK grows, a portion of proceeds is intended to support children and families in need. Specific giving initiatives and partners will be announced when they are formally established.
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
