type PageHeaderProps = {
  title: string;
  eyebrow?: string;
  tone?: "dune" | "blue" | "sand";
};

export function PageHeader({ title, eyebrow, tone = "dune" }: PageHeaderProps) {
  const backgrounds = {
    dune: "bg-[#d8c7a8]",
    blue: "bg-[#a8c2bc]",
    sand: "bg-[#e9e1d3]",
  };

  return (
    <section className={`border-b border-black/10 px-4 py-2 md:px-6 md:py-3 ${backgrounds[tone]}`}>
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p className="mb-2 text-sm font-bold tracking-[0.24em] text-black/65">{eyebrow}</p>
        ) : null}
        <h1 className="font-heading text-[2.25rem] font-bold leading-[0.92] tracking-[-0.055em] md:text-[clamp(2.5rem,8vw,4.5rem)]">
          {title}
        </h1>
      </div>
    </section>
  );
}
