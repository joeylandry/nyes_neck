import { createClient, type SanityClient } from "next-sanity";
import { isSanityConfigured, sanityApiVersion, sanityDataset, sanityProjectId } from "./env";

let client: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured || !sanityProjectId) return null;
  if (!client) {
    client = createClient({
      projectId: sanityProjectId,
      dataset: sanityDataset,
      apiVersion: sanityApiVersion,
      useCdn: true,
    });
  }
  return client;
}
