"use client";

import { useRef, useState, type FormEvent } from "react";

const fieldClass = "mt-2 min-h-12 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#183247]";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("Send us a note and we will follow up.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setStatusMessage("Sending your inquiry...");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message || "We could not send your inquiry. Please try again.");
      }

      formRef.current?.reset();
      setStatus("success");
      setStatusMessage(payload?.message || "Thanks. Your inquiry has been sent.");
    } catch (error) {
      setStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "We could not send your inquiry. Please try again.");
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-[22px] border border-black/10 bg-white p-5 shadow-sm md:rounded-[30px] md:p-9" aria-describedby="form-status">
      <input type="hidden" name="_subject" value="New NYES NECK inquiry" />
      <label className="hidden">
        Leave this field blank
        <input name="_gotcha" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
        <label className="text-sm font-semibold">
          Name
          <input className={fieldClass} name="name" autoComplete="name" required />
        </label>
        <label className="text-sm font-semibold">
          Email
          <input className={fieldClass} name="email" type="email" autoComplete="email" required />
        </label>
      </div>
      <label className="mt-6 block text-sm font-semibold">
        Inquiry type
        <select className={fieldClass} name="inquiryType" defaultValue="general">
          <option value="general">General questions</option>
          <option value="product">Product inquiries</option>
          <option value="wholesale">Wholesale / local partnerships</option>
          <option value="giving">Giving-back partnerships</option>
        </select>
      </label>
      <label className="mt-6 block text-sm font-semibold">
        Message
        <textarea className={`${fieldClass} min-h-40 resize-y`} name="message" required />
      </label>
      <button type="submit" disabled={status === "submitting"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#161616] px-6 text-lg font-semibold text-white transition hover:bg-[#183247] disabled:cursor-not-allowed disabled:opacity-50">
        {status === "submitting" ? "Sending..." : "Send inquiry"}
      </button>
      <p id="form-status" aria-live="polite" className={`mt-3 text-center text-sm ${status === "error" ? "text-red-700" : status === "success" ? "text-[#246a43]" : "text-black/55"}`}>
        {statusMessage}
      </p>
    </form>
  );
}
