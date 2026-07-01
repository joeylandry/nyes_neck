import { defineArrayMember, defineField, defineType } from "sanity";

type ImageRoleEntry = { role?: "main" | "hover" | "gallery" };

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "media", title: "Images" },
    { name: "merchandising", title: "Merchandising" },
    { name: "variants", title: "Variants" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "details", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "details", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "shortDescription", title: "Short description", type: "text", rows: 2, group: "details", validation: (Rule) => Rule.required().max(180) }),
    defineField({ name: "description", title: "Full description", type: "text", rows: 5, group: "details", validation: (Rule) => Rule.required() }),
    defineField({ name: "price", title: "Price", description: "Enter the amount in dollars, for example 68.00.", type: "number", group: "details", validation: (Rule) => Rule.min(0).precision(2) }),
    defineField({ name: "currency", title: "Currency", type: "string", group: "details", initialValue: "USD", options: { list: [{ title: "US dollars (USD)", value: "USD" }], layout: "radio" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "available", title: "Product available", type: "boolean", group: "details", initialValue: false }),
    defineField({ name: "externalLink", title: "External product or checkout link", type: "url", group: "details" }),
    defineField({
      name: "images",
      title: "Product images",
      description: "Add images in display order. Choose Main, Hover, or Gallery on each item. All product images use the required 4:5 crop preview.",
      type: "array",
      group: "media",
      of: [defineArrayMember({ type: "productImage" })],
      validation: (Rule) => Rule.required().min(1).custom((images?: ImageRoleEntry[]) => {
        const mainCount = images?.filter((item) => item?.role === "main").length ?? 0;
        const hoverCount = images?.filter((item) => item?.role === "hover").length ?? 0;
        if (mainCount !== 1) return "Every product must have exactly one Main image.";
        if (hoverCount > 1) return "A product can have no more than one Hover image.";
        return true;
      }),
    }),
    defineField({ name: "productType", title: "Product type", type: "reference", to: [{ type: "productType" }], group: "merchandising", validation: (Rule) => Rule.required() }),
    defineField({ name: "collections", title: "Collections", type: "array", group: "merchandising", of: [defineArrayMember({ type: "reference", to: [{ type: "collection" }] })], validation: (Rule) => Rule.required().min(1).unique() }),
    defineField({ name: "featured", title: "Featured product", type: "boolean", group: "merchandising", initialValue: false }),
    defineField({ name: "sizes", title: "Sizes", type: "array", group: "variants", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "colors", title: "Colors", type: "array", group: "variants", of: [defineArrayMember({ type: "string" })], options: { layout: "tags" } }),
    defineField({ name: "variants", title: "Variants", type: "array", group: "variants", of: [defineArrayMember({ type: "productVariant" })] }),
  ],
  preview: {
    select: { title: "title", productType: "productType.title", media: "images.0.image", available: "available" },
    prepare({ title, productType, media, available }) {
      return { title, subtitle: `${productType ?? "Product type required"} · ${available ? "Available" : "Coming soon"}`, media };
    },
  },
});
