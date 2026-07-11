"use client";

import { useEffect, useState } from "react";

const storageKey = "nyes-neck-youth-apparel-banner-dismissed";

function setAnnouncementOffset(isVisible: boolean) {
  document.documentElement.style.setProperty(
    "--announcement-offset",
    isVisible ? "var(--announcement-height)" : "0px",
  );
}

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let dismissed = false;

    try {
      dismissed = window.localStorage.getItem(storageKey) === "true";
    } catch {
      dismissed = false;
    }

    setIsVisible(!dismissed);
    setAnnouncementOffset(!dismissed);
  }, []);

  function dismissBanner() {
    try {
      window.localStorage.setItem(storageKey, "true");
    } catch {
      // Storage can be unavailable in private browsing or locked-down contexts.
    }

    setIsVisible(false);
    setAnnouncementOffset(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div
      data-site-header-offset
      className="fixed inset-x-0 top-0 z-[55] flex h-[var(--announcement-height)] items-center justify-center bg-[#183247] px-12 text-center text-[0.98rem] font-semibold leading-tight text-white shadow-sm md:text-[1.05rem]"
    >
      <p>Youth and children apparel coming soon</p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full text-lg font-bold leading-none text-white transition hover:bg-white/12 focus-visible:outline-white md:right-4"
        onClick={dismissBanner}
      >
        X
      </button>
    </div>
  );
}
