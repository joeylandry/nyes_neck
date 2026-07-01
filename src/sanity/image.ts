import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityDataset, sanityProjectId } from "./env";

type ImageSource = {
  asset?: { _ref?: string };
  crop?: unknown;
  hotspot?: unknown;
};

export function sanityImageUrl(source: ImageSource, width: number, height: number): string | undefined {
  if (!sanityProjectId || !source?.asset) return undefined;
  return createImageUrlBuilder({ projectId: sanityProjectId, dataset: sanityDataset })
    .image(source as SanityImageSource)
    .width(width)
    .height(height)
    .fit("crop")
    .auto("format")
    .url();
}
