"use client";

import { useRef, useState, type FormEvent } from "react";

type NewsletterSignupFormProps = {
  heading: string;
  description: string;
  placeholder: string;
  buttonText: string;
  successMessage: string;
  privacyNote?: string;
  onSuccess?: () => void;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const inputClass =
  "min-h-12 w-full rounded-full border border-white/35 bg-white px-5 py-3 text-base text-[#161616] outline-none transition placeholder:text-black/45 focus:border-white focus:ring-2 focus:ring-white/45 disabled:cursor-not-allowed disabled:opacity-70";

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
  onSuccess,
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
      onSuccess?.();
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "We could not add you to the list. Please try again.");
    }
  }

  return (
    <form
      ref={formRef}
      className="text-white"
      onSubmit={handleSubmit}
      aria-describedby={
        [
          description ? "newsletter-description" : "",
          "newsletter-status",
          privacyNote ? "newsletter-privacy" : "",
        ].filter(Boolean).join(" ")
      }
    >
      <label className="sr-only">
        Leave this field blank
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div>
        <h3 className="font-heading text-2xl font-semibold md:text-3xl">{heading}</h3>
        {description ? (
          <p id="newsletter-description" className="mt-2 text-base leading-7 text-white/75">
            {description}
          </p>
        ) : null}
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
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-[#183247] transition hover:bg-[#e9e1d3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#183247] disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-none"
        >
          {status === "submitting" ? "Joining..." : buttonText}
        </button>
      </div>
      <p
        id="newsletter-status"
        aria-live="polite"
        className={`mt-3 min-h-6 text-sm ${
          status === "error" ? "text-[#ffd7d7]" : status === "success" ? "text-[#d8f4df]" : "text-white/68"
        }`}
      >
        {statusMessage}
      </p>
      {privacyNote ? (
        <p id="newsletter-privacy" className="mt-2 text-sm leading-6 text-white/62">
          {privacyNote}
        </p>
      ) : null}
    </form>
  );
}
