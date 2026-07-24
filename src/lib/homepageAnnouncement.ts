import { getSanityClient } from "@/sanity/client";
import { sanityImageUrl } from "@/sanity/image";

export type HomepageAnnouncementTheme = "dune" | "seaGlass" | "navy";

export type HomepageAnnouncementSettings = {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  body: string;
  launchDateText?: string;
  newsletterHeading: string;
  newsletterDescription: string;
  emailPlaceholder: string;
  buttonText: string;
  successMessage: string;
  privacyNote?: string;
  backgroundImageUrl?: string;
  theme: HomepageAnnouncementTheme;
};

type SanityHomepageAnnouncement = {
  enabled?: boolean;
  eyebrow?: string;
  heading?: string;
  body?: string;
  launchDateText?: string;
  newsletterHeading?: string;
  newsletterDescription?: string;
  emailPlaceholder?: string;
  buttonText?: string;
  successMessage?: string;
  privacyNote?: string;
  backgroundImage?: { asset?: { _ref?: string }; crop?: unknown; hotspot?: unknown };
  theme?: HomepageAnnouncementTheme;
};

export const fallbackHomepageAnnouncement: HomepageAnnouncementSettings = {
  enabled: true,
  eyebrow: "",
  heading: "Ordering Available Soon!",
  body: "",
  newsletterHeading: "Be the first to know",
  newsletterDescription: "",
  emailPlaceholder: "Enter your email",
  buttonText: "Join the List",
  successMessage: "You’re on the list. We’ll be in touch before launch.",
  privacyNote: "No spam—only occasional Nyes Neck updates.",
  theme: "dune",
};

const homepageAnnouncementQuery = `*[_type == "homepageAnnouncement" && _id == "homepageAnnouncement"][0] {
  enabled,
  eyebrow,
  heading,
  body,
  launchDateText,
  newsletterHeading,
  newsletterDescription,
  emailPlaceholder,
  buttonText,
  successMessage,
  privacyNote,
  backgroundImage{asset, crop, hotspot},
  theme
}`;

function trimText(value: string | undefined, fallback?: string) {
  const text = value?.trim();
  return text || fallback || "";
}

function getTheme(value: SanityHomepageAnnouncement["theme"]): HomepageAnnouncementTheme {
  return value === "seaGlass" || value === "navy" ? value : "dune";
}

function mapAnnouncement(record: SanityHomepageAnnouncement): HomepageAnnouncementSettings {
  return {
    enabled: record.enabled !== false,
    eyebrow: trimText(record.eyebrow),
    heading: trimText(record.heading, fallbackHomepageAnnouncement.heading),
    body: trimText(record.body),
    launchDateText: trimText(record.launchDateText) || undefined,
    newsletterHeading: trimText(record.newsletterHeading, fallbackHomepageAnnouncement.newsletterHeading),
    newsletterDescription: trimText(record.newsletterDescription),
    emailPlaceholder: trimText(record.emailPlaceholder, fallbackHomepageAnnouncement.emailPlaceholder),
    buttonText: trimText(record.buttonText, fallbackHomepageAnnouncement.buttonText),
    successMessage: trimText(record.successMessage, fallbackHomepageAnnouncement.successMessage),
    privacyNote: trimText(record.privacyNote, fallbackHomepageAnnouncement.privacyNote) || undefined,
    backgroundImageUrl: record.backgroundImage ? sanityImageUrl(record.backgroundImage, 2200, 1300) : undefined,
    theme: getTheme(record.theme),
  };
}

export async function getHomepageAnnouncement(): Promise<HomepageAnnouncementSettings> {
  const client = getSanityClient();
  if (!client) return fallbackHomepageAnnouncement;

  const record = await client.fetch<SanityHomepageAnnouncement | null>(
    homepageAnnouncementQuery,
    {},
    { next: { revalidate: 60, tags: ["homepageAnnouncement"] } },
  );

  return record ? mapAnnouncement(record) : fallbackHomepageAnnouncement;
}
