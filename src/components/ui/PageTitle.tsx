type PageTitleProps = {
  title: string;
};

export function PageTitle({ title }: PageTitleProps) {
  return (
    <section className="bg-background px-4 py-3 md:px-6 md:py-5">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-heading text-6xl font-bold leading-none tracking-normal md:text-7xl">
          {title}
        </h1>
      </div>
    </section>
  );
}
