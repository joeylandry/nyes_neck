import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "./env";

let client: SanityClient | undefined;

/**
 * Resolved on first use rather than at module scope: throwing while the module
 * evaluates fails `next build` during page-data collection for anyone without
 * the write token, even though only two route handlers ever need it. Both call
 * this inside a try/catch, so a missing token still surfaces as a 500 at
 * request time.
 */
export function getSanityWriteClient(): SanityClient {
  if (client) return client;

  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN");
  }

  client = createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    token,
    useCdn: false,
  });
  return client;
}
