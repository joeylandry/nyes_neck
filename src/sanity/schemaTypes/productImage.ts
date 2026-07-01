import { defineField, defineType } from "sanity";

export const PRODUCT_IMAGE_ASPECT_RATIO = 4 / 5;

export const productImage = defineType({
  name: "productImage",
  title: "Product image",
  type: "object",
  fields: [
    defineField({
      name: "role",
      title: "Image type",
      type: "string",
      initialValue: "gallery",
      options: {
        layout: "radio",
        list: [
          { title: "Main image", value: "main" },
          { title: "Hover image", value: "hover" },
          { title: "Gallery image", value: "gallery" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image upload and crop",
      description: "Required crop: 4:5 portrait. Use the 4:5 preview in the hotspot editor to position the final image.",
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "Required product crop · 4:5", aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO }],
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      description: "Describe the product and view for customers using screen readers.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { role: "role", media: "image", alt: "alt" },
    prepare({ role, media, alt }) {
      const labels: Record<string, string> = { main: "Main", hover: "Hover", gallery: "Gallery" };
      return {
        title: `${labels[role] ?? "Product"} image`,
        subtitle: `${alt ?? "Alt text required"} · 4:5 crop`,
        media,
      };
    },
  },
});
