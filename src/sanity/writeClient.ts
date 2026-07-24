import "server-only";
import { createClient } from "next-sanity";
import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "./env";

const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!token) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN");
}

export const sanityWriteClient = createClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  token,
  useCdn: false,
});
