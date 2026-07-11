import type { Metadata } from "next";
import Image from "next/image";
import { PageTitle } from "@/components/ui/PageTitle";

export const metadata: Metadata = {
  title: "About | NYES NECK",
  description: "Joey Landry's story and the community purpose behind NYES NECK.",
};

type StoryFeature = {
  title: string;
  body: string;
  image: string;
  width: number;
  height: number;
  imageAlt: string;
  imageSide: "left" | "right";
};

const storyFeatures: StoryFeature[] = [
  {
    title: "My first fundraiser",
    body:
      "When I was nine, I got my first glimpse of the joy Make-A-Wish brings to children with critical illnesses, and it inspired me to help from Nyes Neck. Pictured here is my first fundraiser, where I sold lemonade and iced tea to support that mission.",
    image: "/images/about/MAW_9.JPG",
    width: 3264,
    height: 2448,
    imageAlt: "The first Nyes Neck Make-A-Wish fundraiser table.",
    imageSide: "right",
  },
  {
    title: "A neighborhood tradition",
    body:
      "My first project was a 2013 lemonade stand with bracelet sales in Nyes Neck. It raised $50, then grew over the next eight years into movie nights, raffles, apparel, and galas. Pictured here is my last fundraiser, a live music event after the annual meeting that helped push the total raised past $20,000.",
    image: "/images/about/MAW_18.JPG",
    width: 3784,
    height: 2838,
    imageAlt: "The final Nyes Neck Make-A-Wish fundraiser before college.",
    imageSide: "left",
  },
  {
    title: "Over $20K for Make-A-Wish",
    body:
      "I raised more than $20,000 for Make-A-Wish Massachusetts and Rhode Island with support from the Nyes Neck community. That same purpose now carries into Nyes Neck Clothing and Apparel.",
    image: "/images/about/Thank you graphic.png",
    width: 2000,
    height: 1428,
    imageAlt: "Thank-you graphic sharing the Nyes Neck Make-A-Wish fundraising story.",
    imageSide: "right",
  },
];

function StoryFeatureRow({ feature }: { feature: StoryFeature }) {
  const imageFirst = feature.imageSide === "left";

  return (
    <article className="grid items-center gap-6 border-b border-black/10 py-10 last:border-b-0 md:grid-cols-[0.92fr_1.08fr] md:gap-16 md:py-16">
      <div className={imageFirst ? "md:order-1" : "md:order-2"}>
        <div className="overflow-hidden rounded-[22px] bg-surface p-2 shadow-sm md:rounded-[30px]">
          <Image
            src={feature.image}
            alt={feature.imageAlt}
            width={feature.width}
            height={feature.height}
            sizes="(min-width: 768px) 48vw, 100vw"
            className="h-auto w-full rounded-[16px] object-cover md:rounded-[24px]"
            quality={92}
          />
        </div>
      </div>
      <div className={imageFirst ? "md:order-2" : "md:order-1"}>
        <h3 className="font-heading text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] md:text-5xl">
          {feature.title}
        </h3>
        <p className="mt-5 text-base leading-7 text-black/70 md:mt-7 md:text-xl md:leading-9">
          {feature.body}
        </p>
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <main>
      <PageTitle title="About" />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-20">
        <section className="grid gap-5 border-b border-black/10 pb-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pb-20">
          <h2 className="font-heading text-[2rem] font-semibold leading-[1.05] tracking-[-0.045em] md:text-5xl">
            Continuing where I left off
          </h2>
          <div className="space-y-6 text-base leading-7 text-black/70 md:space-y-7 md:text-lg md:leading-8">
            <p>
              Hi, I&apos;m Joey Landry. I started fundraising in Nyes Neck when I was nine, and over the years that work grew into more than $20,000 raised for Make-A-Wish Massachusetts and Rhode Island. I&apos;m carrying that same purpose into Nyes Neck Clothing and Apparel, with the goal of helping people affected by domestic violence and children in need.
            </p>
            <p>
              My long-term goal is to build a nonprofit around this work. In the meantime, Nyes Neck Clothing and Apparel will continue giving back, including support for St. Jude Children&apos;s Research Hospital.
            </p>
            <p className="font-semibold text-[#183247]">
              Reflecting on the work, I said, &quot;I have been given an amazing opportunity to help provide life-changing experiences for wish children.&quot; That same purpose remains part of Nyes Neck Clothing and Apparel today.
            </p>
          </div>
        </section>

        <section className="pt-6 md:pt-14">
          {storyFeatures.map((feature) => (
            <StoryFeatureRow key={feature.title} feature={feature} />
          ))}
        </section>

        <section className="border-t border-black/10 pt-8 text-center md:pt-12">
          <p className="mx-auto max-w-3xl font-heading text-3xl font-semibold leading-tight text-[#183247] md:text-5xl">
            Thank you to everyone who has supported Nyes Neck, Make-A-Wish, and every fundraiser along the way.
          </p>
        </section>
      </div>
    </main>
  );
}
