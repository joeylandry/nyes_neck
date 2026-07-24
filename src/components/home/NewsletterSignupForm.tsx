"use client";

import { useRef, useState, type FormEvent } from "react";

type NewsletterSignupFormProps = {
  heading: string;
  description: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  privacyNote?: string;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass =
  "min-h-12 w-full rounded-full border border-black/20 bg-white px-5 py-3 text-base text-[#161616] outline-none transition placeholder:text-black/45 focus:border-[#183247] focus:ring-2 focus:ring-[#183247]/20 disabled:cursor-not-allowed disabled:opacity-70";

function isValidEmail(email: string) {
  return email.length <= 254 && emailPattern.test(email);
}

export function NewsletterSignupForm({
  heading,
  description,
  placeholder,
  buttonText,
  successMessage,
  privacyNote,
}: NewsletterSignupFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const emailValue = formData.get("email");
    const websiteValue = formData.get("website");
    const email = typeof emailValue === "string" ? emailValue.trim() : "";
    const website = typeof websiteValue === "string" ? websiteValue : "";

    if (!isValidEmail(email)) {
      setStatus("error");
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setStatusMessage("Joining the list...");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          website,
          source: "homepage-announcement",
        }),
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message || "We could not add you to the list. Please try again.");
      }

      formRef.current?.reset();
      setStatus("success");
      setStatusMessage(payload?.message || successMessage);
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "We could not add you to the list. Please try again.");
    }
  }

  return (
    <form
      ref={formRef}
      className="border border-black/10 bg-white/90 p-5 text-[#161616] shadow-lg shadow-black/10 backdrop-blur md:p-7"
      onSubmit={handleSubmit}
      aria-describedby={
        privacyNote
          ? "newsletter-description newsletter-status newsletter-privacy"
          : "newsletter-description newsletter-status"
      }
    >
      <label className="sr-only">
        Leave this field blank
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div>
        <h3 className="font-heading text-2xl font-semibold md:text-3xl">{heading}</h3>
        <p id="newsletter-description" className="mt-2 text-base leading-7 text-black/68">
          {description}
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          className={inputClass}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={placeholder}
          required
          disabled={status === "submitting"}
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#161616] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#183247] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#183247] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-none"
        >
          {status === "submitting" ? "Joining..." : buttonText}
        </button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={`mt-3 min-h-6 text-sm ${
          status === "error" ? "text-red-700" : status === "success" ? "text-[#246a43]" : "text-black/55"
        }`}
      >
        {statusMessage}
      </p>
      {privacyNote ? (
        <p id="newsletter-privacy" className="mt-2 text-sm leading-6 text-black/55">
          {privacyNote}
        </p>
      ) : null}
    </form>
  );
}
