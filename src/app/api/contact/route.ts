import { NextResponse } from "next/server";
import { getSanityWriteClient } from "@/sanity/writeClient";

export const runtime = "nodejs";

const successMessage = "Thanks. Your inquiry has been sent.";
const deliveryErrorMessage = "We could not send your inquiry. Please try again.";
const inquiryTypes = new Set(["general", "product", "wholesale", "giving"]);
const fieldLimits = { name: 120, email: 254, message: 5000 } as const;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function json(message: string, status = 200) {
  return NextResponse.json({ message }, { status });
}

/** Ignore the unedited placeholder copied from `.env.example`. */
function getFormspreeEndpoint() {
  const endpoint = (process.env.CONTACT_FORM_ENDPOINT || process.env.FORMSPREE_ENDPOINT || "").trim();
  if (!endpoint || endpoint.includes("your-form-id")) return null;
  return endpoint;
}

type Inquiry = { name: string; email: string; inquiryType: string; message: string };

async function saveToSanity(inquiry: Inquiry) {
  await getSanityWriteClient().create({
    _type: "contactSubmission",
    ...inquiry,
    submittedAt: new Date().toISOString(),
    handled: false,
  });
}

async function sendToFormspree(endpoint: string, inquiry: Inquiry) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      ...inquiry,
      _replyto: inquiry.email,
      _subject: `New Nyes Neck inquiry from ${inquiry.name}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Formspree responded ${response.status}: ${detail.slice(0, 300)}`);
  }
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return json("Please submit the contact form again.", 400);
  }

  if (getText(formData, "_gotcha")) {
    return json(successMessage);
  }

  const inquiry: Inquiry = {
    name: getText(formData, "name"),
    email: getText(formData, "email"),
    inquiryType: getText(formData, "inquiryType"),
    message: getText(formData, "message"),
  };

  for (const field of ["name", "email", "message"] as const) {
    if (!inquiry[field]) return json(`Please enter your ${field}.`, 400);
    if (inquiry[field].length > fieldLimits[field]) {
      return json(`Your ${field} is too long. Please shorten it and try again.`, 400);
    }
  }

  if (!isValidEmail(inquiry.email)) {
    return json("Please enter a valid email address.", 400);
  }

  if (!inquiryTypes.has(inquiry.inquiryType)) {
    inquiry.inquiryType = "general";
  }

  // Every inquiry is stored in Sanity (Studio → Contact submission) so none are
  // lost, and is also emailed through Formspree when an endpoint is configured.
  // The visitor sees success as long as at least one delivery worked.
  const endpoint = getFormspreeEndpoint();
  const deliveries = [saveToSanity(inquiry), ...(endpoint ? [sendToFormspree(endpoint, inquiry)] : [])];
  const results = await Promise.allSettled(deliveries);

  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Contact form delivery failed:", result.reason);
    }
  }

  if (!results.some((result) => result.status === "fulfilled")) {
    return json(deliveryErrorMessage, 502);
  }

  return json(successMessage);
}
