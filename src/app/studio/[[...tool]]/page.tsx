"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1e9] p-6 text-[#161616]">
        <div className="max-w-xl rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="font-heading text-3xl font-semibold">Connect Sanity</h1>
          <p className="mt-4 leading-7 text-black/65">
            Add NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to the environment, then restart the site to open NYES NECK Studio.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
