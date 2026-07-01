import { defineCliConfig } from "sanity/cli";
import { sanityDataset, sanityProjectId } from "./src/sanity/env";

export default defineCliConfig({
  api: { projectId: sanityProjectId ?? "missing", dataset: sanityDataset },
  deployment: { appId: "xtx1pc3qrv8zeksq3ny2qqhp" },
});
