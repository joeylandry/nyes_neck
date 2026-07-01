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
    <section className={`border-b border-black/10 px-5 py-7 md:px-6 md:py-9 ${backgrounds[tone]}`}>
      <div className="mx-auto max-w-6xl">
        {eyebrow ? (
          <p className="mb-4 text-xs font-bold tracking-[0.24em] text-black/65">{eyebrow}</p>
        ) : null}
        <h1 className="font-heading text-[clamp(4.2rem,15vw,6.75rem)] font-bold leading-[0.86] tracking-[-0.075em]">
          {title}
        </h1>
      </div>
    </section>
  );
}
