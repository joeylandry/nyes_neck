"use client";

import { useEffect, useRef, useState } from "react";
import type { HomepageAnnouncementSettings } from "@/lib/homepageAnnouncement";
import { NewsletterSignupForm } from "./NewsletterSignupForm";

const storageKey = "nyes-neck-homepage-announcement-dismissed";

export function HomepageAnnouncement({ announcement }: { announcement: HomepageAnnouncementSettings }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!announcement.enabled) {
      return;
    }

    let dismissed = false;

    try {
      dismissed = window.localStorage.getItem(storageKey) === "true";
    } catch {
      dismissed = false;
    }

    if (!dismissed) {
      setIsVisible(true);
    }
  }, [announcement.enabled]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        dismissAnnouncement();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible]);

  function rememberDismissal() {
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch {
      // Storage can be unavailable in private browsing or locked-down contexts.
    }
  }

  function dismissAnnouncement() {
    rememberDismissal();
    setIsVisible(false);
  }

  function rememberSignup() {
    rememberDismissal();
  }

  if (!announcement.enabled || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      role="presentation"
    >
      <section
        className="relative max-h-[calc(100svh-3rem)] w-full max-w-[36rem] overflow-y-auto bg-[#183247] px-5 py-7 text-center text-white shadow-2xl shadow-black/25 md:px-8 md:py-8"
        aria-labelledby="homepage-announcement-heading"
        aria-modal="true"
        role="dialog"
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Dismiss announcement"
          className="absolute right-2 top-2 flex min-h-10 min-w-10 items-center justify-center rounded-full text-lg font-bold leading-none text-white transition hover:bg-white/12 focus-visible:outline-white motion-reduce:transition-none"
          onClick={dismissAnnouncement}
        >
          X
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
            onSuccess={rememberSignup}
          />
        </div>
      </section>
    </div>
  );
}
