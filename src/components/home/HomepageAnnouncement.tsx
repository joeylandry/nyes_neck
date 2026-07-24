import Image from "next/image";
import type { HomepageAnnouncementSettings, HomepageAnnouncementTheme } from "@/lib/homepageAnnouncement";
import { NewsletterSignupForm } from "./NewsletterSignupForm";

const themeClasses: Record<
  HomepageAnnouncementTheme,
  {
    section: string;
    eyebrow: string;
    body: string;
    date: string;
  }
> = {
  dune: {
    section: "bg-[#e9e1d3] text-[#161616]",
    eyebrow: "text-[#183247]",
    body: "text-black/70",
    date: "border-[#183247]/20 bg-white/45 text-[#183247]",
  },
  seaGlass: {
    section: "bg-[#dfe9e5] text-[#161616]",
    eyebrow: "text-[#183247]",
    body: "text-black/70",
    date: "border-[#183247]/20 bg-white/50 text-[#183247]",
  },
  navy: {
    section: "bg-[#183247] text-white",
    eyebrow: "text-[#e9e1d3]",
    body: "text-white/78",
    date: "border-white/22 bg-white/10 text-white",
  },
};

export function HomepageAnnouncement({ announcement }: { announcement: HomepageAnnouncementSettings }) {
  if (!announcement.enabled) {
    return null;
  }

  const theme = themeClasses[announcement.theme];

  return (
    <section
      className={`relative isolate overflow-hidden px-4 py-14 md:px-6 md:py-20 ${theme.section}`}
      aria-labelledby="homepage-announcement-heading"
    >
      {announcement.backgroundImageUrl ? (
        <>
          <Image
            src={announcement.backgroundImageUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-28"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,248,243,0.9),rgba(250,248,243,0.62))] mix-blend-screen" />
          <div className="absolute inset-0 bg-black/18" />
        </>
      ) : null}
      <div className="relative z-10 mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] md:items-center md:gap-12">
        <div className="max-w-2xl">
          <p className={`text-sm font-bold uppercase ${theme.eyebrow}`}>
            {announcement.eyebrow}
          </p>
          <h2
            id="homepage-announcement-heading"
            className="mt-3 max-w-2xl font-heading text-4xl font-semibold leading-none md:text-6xl"
          >
            {announcement.heading}
          </h2>
          <p className={`mt-5 max-w-xl text-lg leading-8 md:text-xl md:leading-9 ${theme.body}`}>
            {announcement.body}
          </p>
          {announcement.launchDateText ? (
            <p className={`mt-6 inline-flex min-h-10 items-center border px-4 py-2 text-base font-semibold ${theme.date}`}>
              {announcement.launchDateText}
            </p>
          ) : null}
        </div>
        <NewsletterSignupForm
          heading={announcement.newsletterHeading}
          description={announcement.newsletterDescription}
          placeholder={announcement.emailPlaceholder}
          buttonText={announcement.buttonText}
          successMessage={announcement.successMessage}
          privacyNote={announcement.privacyNote}
        />
      </div>
    </section>
  );
}
