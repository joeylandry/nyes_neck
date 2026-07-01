import { defineField, defineType } from "sanity";

export const shopSettings = defineType({
  name: "shopSettings",
  title: "Shop page",
  type: "document",
  fields: [
    defineField({ name: "featuredLabel", title: "Featured heading label", description: "For example: Featured", type: "string", initialValue: "Featured", validation: (Rule) => Rule.required() }),
    defineField({
      name: "featuredCategory",
      title: "Featured product type or collection",
      type: "reference",
      to: [{ type: "productType" }, { type: "collection" }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { prepare: () => ({ title: "Shop page" }) },
});
