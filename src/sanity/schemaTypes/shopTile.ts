import { defineField, defineType } from "sanity";

export const shopTile = defineType({
  name: "shopTile",
  title: "Shop tile",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Tile name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "href",
      title: "Hyperlink",
      type: "string",
      description: "Use a site path such as /shop/category/hats or a full https:// URL.",
      validation: (Rule) => Rule.required().custom((value) => {
        if (!value || value.startsWith("/") || /^https:\/\//.test(value)) return true;
        return "Enter a site path beginning with / or a full https:// URL.";
      }),
    }),
    defineField({
      name: "image",
      title: "Tile image upload and crop",
      description: "Required crop: 4:3 landscape. Use the 4:3 preview in the hotspot editor.",
      type: "image",
      options: { hotspot: { previews: [{ title: "Required tile crop · 4:3", aspectRatio: 4 / 3 }] } },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "alt", title: "Alternative text", type: "string", validation: (Rule) => Rule.required() }),
  ],
  preview: {
    select: { title: "name", subtitle: "href", media: "image" },
  },
});
