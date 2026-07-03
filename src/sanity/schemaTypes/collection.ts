import { defineField, defineType } from "sanity";

export const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "active",
      title: "Active",
      description: "When off, this collection appears as Coming soon and customers cannot open it.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    defineField({
      name: "tileImage",
      title: "Shop tile image and crop",
      description: "Upload the image shown under Shop by collection, then position its 4:3 crop in the hotspot editor.",
      type: "image",
      options: {
        hotspot: {
          previews: [{ title: "Shop tile crop · 4:3", aspectRatio: 4 / 3 }],
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tileImageAlt",
      title: "Shop tile alternative text",
      description: "Briefly describe the tile image for customers using screen readers.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current", media: "tileImage" } },
});
