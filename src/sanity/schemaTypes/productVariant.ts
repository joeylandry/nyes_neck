import { defineField, defineType } from "sanity";

export const productVariant = defineType({
  name: "productVariant",
  title: "Product variant",
  type: "object",
  fields: [
    defineField({ name: "sku", title: "SKU", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "size", title: "Size", type: "string" }),
    defineField({ name: "color", title: "Color", type: "string" }),
    defineField({ name: "available", title: "Available", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { sku: "sku", size: "size", color: "color", available: "available" },
    prepare({ sku, size, color, available }) {
      return {
        title: [size, color].filter(Boolean).join(" · ") || sku,
        subtitle: `${sku} · ${available ? "Available" : "Unavailable"}`,
      };
    },
  },
});
