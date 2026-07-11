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
    title: "The first glimpse",
    body:
      "When Joey Landry was nine, a neighbor's friend received a wish. That moment gave him his first glimpse of the joy Make-A-Wish brings to children with critical illnesses, and it inspired him to help from his own neighborhood.",
    image: "/images/about/MAW_9.JPG",
    width: 3264,
    height: 2448,
    imageAlt: "The first Nyes Neck Make-A-Wish fundraiser table.",
    imageSide: "right",
  },
  {
    title: "From $250 to a tradition",
    body:
      "His first project was a 2013 lemonade stand with bracelet sales in Nyes Neck. It raised $250, then grew over the next eight years into movie night gift bags, s'mores kits, apparel, and summer fundraisers.",
    image: "/images/about/MAW_18.JPG",
    width: 3784,
    height: 2838,
    imageAlt: "The final Nyes Neck Make-A-Wish fundraiser before college.",
    imageSide: "left",
  },
  {
    title: "Over $20K for Make-A-Wish",
    body:
      "The thank-you graphic marks the result of that work: Joey Landry raised more than $20,000 for Make-A-Wish Massachusetts and Rhode Island with support from the Nyes Neck community. That purpose now carries into NYES NECK.",
    image: "/images/about/Thank you graphic.png",
    width: 2000,
    height: 1428,
    imageAlt: "Thank-you graphic sharing the Nyes Neck Make-A-Wish fundraising story.",
    imageSide: "right",
  },
];

const makeAWishPurpose =
  'Reflecting on the work, Joey said, "I have been given an amazing opportunity to help provide life-changing experiences for wish children." That same purpose remains part of NYES NECK today.';

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
            The fundraiser that grew
          </h2>
          <div className="space-y-6 text-base leading-7 text-black/70 md:space-y-7 md:text-lg md:leading-8">
            <p>
              Inspired to help, Joey started with a lemonade stand and bracelet sales in his Nyes Neck neighborhood. His first 2013 fundraiser brought in $250. Year after year, he kept going with movie night gift bags, s&apos;mores kits, apparel, and local community support.
            </p>
          </div>
        </section>

        <section className="pt-6 md:pt-14">
          {storyFeatures.map((feature) => (
            <StoryFeatureRow key={feature.title} feature={feature} />
          ))}
        </section>

        <section className="border-t border-black/10 pt-8 md:pt-12">
          <div className="ml-auto max-w-3xl rounded-[22px] border border-black/10 bg-[#a8c2bc]/55 p-6 text-[#183247] shadow-sm md:rounded-[30px] md:p-9">
            <p className="text-base font-semibold leading-8 md:text-xl md:leading-9">
              {makeAWishPurpose}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
