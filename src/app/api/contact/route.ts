import { NextResponse } from "next/server";

const requiredFields = ["name", "email", "message"] as const;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  if (getText(formData, "_gotcha")) {
    return NextResponse.json({ message: "Thanks. Your inquiry has been sent." });
  }

  const missingField = requiredFields.find((field) => !getText(formData, field));

  if (missingField) {
    return NextResponse.json({ message: `Please enter your ${missingField}.` }, { status: 400 });
  }

  if (!isValidEmail(getText(formData, "email"))) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  const endpoint = process.env.FORMSPREE_ENDPOINT;

  if (!endpoint) {
    return NextResponse.json({ message: "Contact form is not configured yet." }, { status: 500 });
  }

  try {
    const formspreeResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    });

    if (!formspreeResponse.ok) {
      return NextResponse.json({ message: "We could not send your inquiry. Please try again." }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ message: "We could not send your inquiry. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ message: "Thanks. Your inquiry has been sent." });
}
