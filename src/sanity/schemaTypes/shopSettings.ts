import { defineArrayMember, defineField, defineType } from "sanity";

export const shopSettings = defineType({
  name: "shopSettings",
  title: "Shop page",
  type: "document",
  groups: [
    { name: "featured", title: "Featured products", default: true },
    { name: "browse", title: "Shop tiles" },
  ],
  fields: [
    defineField({ name: "featuredLabel", title: "Featured heading label", description: "For example: Featured", type: "string", group: "featured", initialValue: "Featured", validation: (Rule) => Rule.required() }),
    defineField({
      name: "featuredCategory",
      title: "Featured product type or collection",
      type: "reference",
      group: "featured",
      to: [{ type: "productType" }, { type: "collection" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredProductOrder",
      title: "Featured product order",
      description: "Add products from the featured category, then drag them into the order they should appear. Products not added here appear afterward.",
      type: "array",
      group: "featured",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "productTileOrder",
      title: "Shop by product order",
      description: "Add each product type, then drag the entries into the desired tile order. Product types not added here appear afterward.",
      type: "array",
      group: "browse",
      of: [defineArrayMember({ type: "reference", to: [{ type: "productType" }] })],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "collectionTileOrder",
      title: "Shop by collection order",
      description: "Add each collection, then drag the entries into the desired tile order. Collections not added here appear afterward.",
      type: "array",
      group: "browse",
      of: [defineArrayMember({ type: "reference", to: [{ type: "collection" }] })],
      validation: (Rule) => Rule.unique(),
    }),
  ],
  preview: { prepare: () => ({ title: "Shop page" }) },
});
