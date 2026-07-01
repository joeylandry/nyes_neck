import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { sanityDataset, sanityProjectId } from "./src/sanity/env";

export default defineConfig({
  name: "default",
  title: "NYES NECK",
  projectId: sanityProjectId ?? "missing",
  dataset: sanityDataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem().title("Shop page").child(S.document().schemaType("shopSettings").documentId("shopSettings")),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => item.getId() !== "shopSettings"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});
