import { defineField, defineType } from "sanity";

export const homepageAnnouncement = defineType({
  name: "homepageAnnouncement",
  title: "Homepage announcement",
  type: "document",
  groups: [
    { name: "content", title: "Announcement", default: true },
    { name: "newsletter", title: "Newsletter signup" },
    { name: "design", title: "Design" },
  ],
  initialValue: {
    enabled: true,
    eyebrow: "",
    heading: "Ordering Available Soon!",
    body: "",
    newsletterHeading: "Be the first to know",
    newsletterDescription: "",
    emailPlaceholder: "Enter your email",
    buttonText: "Join the List",
    successMessage: "You’re on the list. We’ll be in touch before launch.",
    privacyNote: "No spam—only occasional Nyes Neck updates.",
    theme: "dune",
  },
  fields: [
    defineField({
      name: "enabled",
      title: "Show announcement",
      type: "boolean",
      group: "content",
      initialValue: true,
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow text",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "heading",
      title: "Main heading",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body text",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "launchDateText",
      title: "Launch date text",
      description: "Optional short text, for example: Launching Summer 2026.",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "newsletterHeading",
      title: "Newsletter heading",
      type: "string",
      group: "newsletter",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "newsletterDescription",
      title: "Newsletter description",
      type: "text",
      rows: 2,
      group: "newsletter",
    }),
    defineField({
      name: "emailPlaceholder",
      title: "Email input placeholder",
      type: "string",
      group: "newsletter",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonText",
      title: "Submit button text",
      type: "string",
      group: "newsletter",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "successMessage",
      title: "Success message",
      type: "string",
      group: "newsletter",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "privacyNote",
      title: "Privacy note",
      type: "text",
      rows: 2,
      group: "newsletter",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      description: "Optional atmospheric image for the homepage announcement section.",
      type: "image",
      group: "design",
      options: {
        hotspot: {
          previews: [{ title: "Homepage announcement crop · 16:9", aspectRatio: 16 / 9 }],
        },
      },
    }),
    defineField({
      name: "theme",
      title: "Theme",
      type: "string",
      group: "design",
      initialValue: "dune",
      options: {
        layout: "radio",
        list: [
          { title: "Weathered dune", value: "dune" },
          { title: "Sea glass", value: "seaGlass" },
          { title: "Coastal navy", value: "navy" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { enabled: "enabled", title: "heading" },
    prepare({ enabled, title }) {
      return {
        title: "Homepage announcement",
        subtitle: enabled === false ? "Hidden" : title ?? "Visible",
      };
    },
  },
});
