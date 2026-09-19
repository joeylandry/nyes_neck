"use client";

import type { HomepageAnnouncementSettings } from "@/lib/homepageAnnouncement";
import { useDialog } from "@/hooks/useDialog";
import { createPersistentStore, usePersistentStore } from "@/lib/persistentStore";
import { NewsletterSignupForm } from "./NewsletterSignupForm";

const dismissedStore = createPersistentStore<boolean>({
  key: "nyes-neck-homepage-announcement-dismissed-v2",
  fallback: false,
  parse: (value) => (typeof value === "boolean" ? value : value === "true" ? true : undefined),
});

export function HomepageAnnouncement({ announcement }: { announcement: HomepageAnnouncementSettings }) {
  const dismissed = usePersistentStore(dismissedStore);
  const isVisible = announcement.enabled && !dismissed;
  const panelRef = useDialog({ open: isVisible, onClose: () => dismissedStore.set(true) });

  function dismissAnnouncement() {
    dismissedStore.set(true);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      role="presentation"
    >
      <section
        ref={panelRef as React.RefObject<HTMLElement>}
        className="relative max-h-[calc(100svh-3rem)] w-full max-w-[36rem] overflow-y-auto bg-[#183247] px-5 py-7 text-center text-white shadow-2xl shadow-black/25 md:px-8 md:py-8"
        aria-labelledby="homepage-announcement-heading"
        aria-modal="true"
        role="dialog"
      >
        <button
          type="button"
          aria-label="Dismiss announcement"
          className="absolute right-2 top-2 flex min-h-10 min-w-10 items-center justify-center rounded-full text-lg font-bold leading-none text-white transition hover:bg-white/12 focus-visible:outline-white motion-reduce:transition-none"
          onClick={dismissAnnouncement}
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="mx-auto max-w-[30rem] pt-5">
          {announcement.eyebrow ? (
            <p className="text-sm font-bold uppercase text-[#e9e1d3]">
              {announcement.eyebrow}
            </p>
          ) : null}
          <h2
            id="homepage-announcement-heading"
            className={`${announcement.eyebrow ? "mt-3" : ""} font-heading text-3xl font-semibold leading-none md:text-4xl`}
          >
            {announcement.heading}
          </h2>
          {announcement.body ? (
            <p className="mt-4 text-lg leading-7 text-white/82">
              {announcement.body}
            </p>
          ) : null}
          {announcement.launchDateText ? (
            <p className="mt-4 inline-flex min-h-10 items-center border border-white/20 bg-white/10 px-4 py-2 text-base font-semibold text-white">
              {announcement.launchDateText}
            </p>
          ) : null}
        </div>
        <div className="mt-6">
          <NewsletterSignupForm
            heading={announcement.newsletterHeading}
            description={announcement.newsletterDescription}
            placeholder={announcement.emailPlaceholder}
            buttonText={announcement.buttonText}
            successMessage={announcement.successMessage}
            privacyNote={announcement.privacyNote}
            onSuccess={dismissAnnouncement}
          />
        </div>
      </section>
    </div>
  );
}
