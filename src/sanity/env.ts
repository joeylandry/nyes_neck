export const sanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  process.env.SANITY_STUDIO_PROJECT_ID ??
  "stfnq920";
export const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  process.env.SANITY_STUDIO_DATASET ??
  "production";
export const sanityApiVersion = "2026-07-01";

export const isSanityConfigured = Boolean(sanityProjectId && sanityDataset);
