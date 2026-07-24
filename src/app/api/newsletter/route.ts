import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/sanity/writeClient";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const successMessage = "You’re on the list. We’ll be in touch before launch.";
const maxContentLength = 2048;

type NewsletterRequestBody = {
  email?: unknown;
  source?: unknown;
  website?: unknown;
  _gotcha?: unknown;
};

type ExistingSubscriber = {
  _id: string;
  active?: boolean;
};

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function subscriberIdForEmail(email: string) {
  const digest = createHash("sha256").update(email).digest("hex").slice(0, 32);
  return `newsletterSubscriber.${digest}`;
}

function isValidEmail(email: string) {
  return email.length > 0 && email.length <= 254 && emailPattern.test(email);
}

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function json(message: string, status = 200) {
  return NextResponse.json({ message }, { status });
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return json("Newsletter signup is not available from this origin.", 403);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > maxContentLength) {
    return json("Please submit only your email address.", 413);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json("Please submit the signup form again.", 415);
  }

  const body = (await request.json().catch(() => null)) as NewsletterRequestBody | null;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json("Please submit a valid email address.", 400);
  }

  const honeypot = getString(body.website) || getString(body._gotcha);
  if (honeypot) {
    return json(successMessage);
  }

  const email = normalizeEmail(getString(body.email));
  if (!isValidEmail(email)) {
    return json("Please enter a valid email address.", 400);
  }

  const source = getString(body.source).slice(0, 80) || "homepage-announcement";
  const subscribedAt = new Date().toISOString();
  const subscriberId = subscriberIdForEmail(email);

  try {
    const existingSubscriber = await sanityWriteClient.fetch<ExistingSubscriber | null>(
      `*[_type == "newsletterSubscriber" && email == $email] | order(_createdAt desc)[0] {
        _id,
        active
      }`,
      { email },
    );

    if (existingSubscriber?.active) {
      return json(successMessage);
    }

    if (existingSubscriber) {
      await sanityWriteClient
        .patch(existingSubscriber._id)
        .set({ active: true, subscribedAt, source })
        .commit();

      return json(successMessage);
    }

    await sanityWriteClient.createIfNotExists({
      _id: subscriberId,
      _type: "newsletterSubscriber",
      email,
      subscribedAt,
      source,
      active: true,
    });

    return json(successMessage, 201);
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return json("We could not add you to the list. Please try again.", 500);
  }
}
