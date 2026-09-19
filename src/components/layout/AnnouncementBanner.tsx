"use client";

import { ANNOUNCEMENT_STORAGE_KEY } from "@/lib/announcement";
import { createPersistentStore, usePersistentStore } from "@/lib/persistentStore";

const announcementStore = createPersistentStore<boolean>({
  key: ANNOUNCEMENT_STORAGE_KEY,
  fallback: false,
  parse: (value) => (typeof value === "boolean" ? value : value === "true" ? true : undefined),
});

export function AnnouncementBanner() {
  const dismissed = usePersistentStore(announcementStore);

  if (dismissed) return null;

  return (
    <div
      data-announcement-banner
      data-site-header-offset
      className="fixed inset-x-0 top-0 z-[55] flex h-[var(--announcement-height)] items-center justify-center bg-[#183247] px-12 text-center text-[0.98rem] font-semibold leading-tight text-white shadow-sm md:text-[1.05rem]"
    >
      <p>Fresh drops are landing daily—see what&apos;s new!</p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full text-xl leading-none text-white transition hover:bg-white/15 focus-visible:outline-white md:right-4"
        onClick={() => {
          announcementStore.set(true);
          document.documentElement.dataset.announcement = "dismissed";
        }}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>
  );
}
