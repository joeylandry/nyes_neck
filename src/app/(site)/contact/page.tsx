import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "Contact | NYES NECK",
  description: "Contact NYES NECK about products, local partnerships, and our giving-back mission.",
};

const topics = [
  ["General questions", "Notes about the brand and what is ahead."],
  ["Product inquiries", "Questions about future apparel and coastal goods."],
  ["Wholesale / local", "Ideas for thoughtful Upper Cape partnerships."],
  ["Giving back", "Conversations aligned with our charitable purpose."],
];

export default function ContactPage() {
  return (
    <main>
      <PageTitle title="Contact" />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-20">
        <div className="grid gap-9 md:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-heading text-[2rem] font-semibold tracking-[-0.045em] md:text-5xl">Let’s connect</h2>
            <p className="mt-4 text-base leading-7 text-black/65 md:mt-5 md:text-lg md:leading-8">
              Questions about NYES NECK, future products, local partnerships, or our giving-back mission? Choose the topic that best fits your note.
            </p>
            <div className="mt-7 grid gap-2.5 sm:grid-cols-2 md:mt-9 md:gap-3 lg:grid-cols-1">
              {topics.map(([title, copy]) => (
                <article key={title} className="rounded-[18px] border border-black/10 bg-[#e9e1d3]/55 p-4 md:rounded-[24px] md:p-5">
                  <h3 className="font-heading font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/60">{copy}</p>
                </article>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
