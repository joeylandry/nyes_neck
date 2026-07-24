import { defineField, defineType } from "sanity";

export const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "subscribedAt",
      title: "Subscribed at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      initialValue: "homepage-announcement",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { active: "active", email: "email", subscribedAt: "subscribedAt" },
    prepare({ active, email, subscribedAt }) {
      const status = active === false ? "Inactive" : "Active";
      return {
        title: email,
        subtitle: subscribedAt ? `${status} · ${new Date(subscribedAt).toLocaleDateString()}` : status,
      };
    },
  },
});
