import { defineField, defineType } from "sanity";

const inquiryTypes = [
  { title: "General questions", value: "general" },
  { title: "Product inquiries", value: "product" },
  { title: "Wholesale / local partnerships", value: "wholesale" },
  { title: "Giving-back partnerships", value: "giving" },
];

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact submission",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", readOnly: true }),
    defineField({ name: "email", title: "Email", type: "string", readOnly: true }),
    defineField({
      name: "inquiryType",
      title: "Inquiry type",
      type: "string",
      options: { list: inquiryTypes },
      readOnly: true,
    }),
    defineField({ name: "message", title: "Message", type: "text", rows: 8, readOnly: true }),
    defineField({ name: "submittedAt", title: "Submitted at", type: "datetime", readOnly: true }),
    defineField({
      name: "handled",
      title: "Handled",
      description: "Tick once you have replied to this inquiry.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    { title: "Newest first", name: "submittedAtDesc", by: [{ field: "submittedAt", direction: "desc" }] },
  ],
  preview: {
    select: { name: "name", email: "email", submittedAt: "submittedAt", handled: "handled" },
    prepare({ name, email, submittedAt, handled }) {
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString() : "";
      return {
        title: name || email || "Contact submission",
        subtitle: [handled ? "Handled" : "New", email, date].filter(Boolean).join(" · "),
      };
    },
  },
});
