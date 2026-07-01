const fieldClass = "mt-2 min-h-12 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 outline-none transition focus:border-[#183247]";

export function ContactForm() {
  return (
    <form className="rounded-[30px] border border-black/10 bg-white p-6 shadow-sm md:p-9" aria-describedby="form-status">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          Name
          <input className={fieldClass} name="name" autoComplete="name" />
        </label>
        <label className="text-sm font-semibold">
          Email
          <input className={fieldClass} name="email" type="email" autoComplete="email" />
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
        <textarea className={`${fieldClass} min-h-40 resize-y`} name="message" />
      </label>
      <button type="button" disabled className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#161616] px-6 text-lg font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
        Send inquiry
      </button>
      <p id="form-status" className="mt-3 text-center text-sm text-black/55">Online inquiries will be available soon.</p>
    </form>
  );
}
