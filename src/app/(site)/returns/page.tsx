import type { Metadata } from "next";
import Link from "next/link";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "How long Nyes Neck orders take, and how we handle damaged or misprinted items, sizing, cancellations and refunds.",
};

// Every piece is printed or embroidered to order by our production partner,
// Printful, so this mirrors its policy: free replacements or refunds for
// damaged, defective or misprinted items reported within 30 days of
// delivery, and no returns for size, color or change of mind.
const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "Shipping",
    body: (
      <>
        <p>Each order is made for you, which usually takes 2–5 business days (embroidered pieces can take a little longer). Then it ships, and you’ll get an email with tracking. Shipping options and costs are shown at checkout.</p>
        <p><strong>Ordering for the holidays?</strong> Order early. Production and carriers slow down in December.</p>
      </>
    ),
  },
  {
    title: "Made to order",
    body: (
      <>
        <p>Every Nyes Neck piece is printed or embroidered just for you after you order. Since nothing comes from a shelf of stock, we can’t accept returns or exchanges for the wrong size, the wrong color, or a change of mind.</p>
        <p>Not sure which size to pick? <Link href="/contact">Ask us before you order</Link> and we’ll help you choose.</p>
      </>
    ),
  },
  {
    title: "Damaged, defective or misprinted items",
    body: (
      <>
        <p>If your order arrives damaged, has a printing or embroidery mistake, or isn’t the item you ordered, we’ll send a free replacement or give you a full refund for it.</p>
        <p>Let us know within <strong>30 days of delivery</strong>. Send your order number and a clear photo of the problem. You won’t need to mail the item back.</p>
      </>
    ),
  },
  {
    title: "Lost or missing packages",
    body: (
      <p>If tracking stalls or shows delivered but nothing arrived, contact us within 30 days of the expected delivery date and we’ll look into it with the carrier. Please double-check your shipping address at checkout: a package returned because of an incorrect or incomplete address can be reshipped, but the new shipping cost is yours.</p>
    ),
  },
  {
    title: "Cancellations and changes",
    body: (
      <p>Orders go into production quickly. If you need to cancel or change an order, contact us as soon as possible. We can make changes until production starts, but not after.</p>
    ),
  },
  {
    title: "Refunds",
    body: (
      <p>Approved refunds go back to your original payment method. Your bank or card provider may take a few business days to show it.</p>
    ),
  },
];

export default function ShippingReturnsPage() {
  return (
    <>
      <PageTitle title="Shipping & Returns" />
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 md:py-16">
        <p className="text-lg leading-8 text-black/70">
          We want you to love what you get from Nyes Neck. Here’s how shipping works, and how we handle anything that goes wrong.
        </p>
        <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
          {sections.map(({ title, body }) => (
            <section key={title} className="py-7 md:py-9">
              <h2 className="font-heading text-[1.7rem] font-semibold tracking-[-0.035em] md:text-[2rem]">{title}</h2>
              <div className="mt-3 space-y-3 text-base leading-7 text-black/70 [&_a]:font-semibold [&_a]:text-black [&_a]:underline [&_a]:underline-offset-4">{body}</div>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded-[22px] border border-black/10 bg-[#e9e1d3]/55 p-6 md:p-8">
          <h2 className="font-heading text-2xl font-semibold tracking-[-0.03em]">Need help with an order?</h2>
          <p className="mt-2 leading-7 text-black/65">Choose “Order help / returns” on our contact form and include your order number and a photo.</p>
          <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#161616] px-6 text-sm font-bold"><span className="text-white">Contact us</span></Link>
        </div>
      </div>
    </>
  );
}
