import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { sanityDataset, sanityProjectId } from "./src/sanity/env";

const singletonTypes = new Set(["shopSettings", "homepageAnnouncement"]);

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
            S.listItem()
              .title("Homepage announcement")
              .child(S.document().schemaType("homepageAnnouncement").documentId("homepageAnnouncement")),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? "")),
          ]),
    }),
    visionTool(),
  ],
  document: {
    newDocumentOptions: (previous) =>
      previous.filter((templateItem) => !singletonTypes.has(templateItem.templateId ?? "")),
    actions: (previous, context) =>
      singletonTypes.has(context.schemaType)
        ? previous.filter((action) => action.action !== "delete" && action.action !== "duplicate")
        : previous,
  },
  schema: { types: schemaTypes },
});
