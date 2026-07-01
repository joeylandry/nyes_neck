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
    <section className={`h-44 border-b border-black/10 px-5 py-5 md:px-6 md:py-6 ${backgrounds[tone]}`}>
      <div className="mx-auto flex h-full max-w-6xl flex-col justify-end">
        {eyebrow ? (
          <p className="mb-2 text-sm font-bold tracking-[0.24em] text-black/65">{eyebrow}</p>
        ) : null}
        <h1 className="font-heading text-[clamp(3.25rem,12vw,6rem)] font-bold leading-[0.86] tracking-[-0.065em]">
          {title}
        </h1>
      </div>
    </section>
  );
}
