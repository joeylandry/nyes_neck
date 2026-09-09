"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import type { Product } from "@/types/product";
import { ProductSwatches } from "./ProductCard";

type ViewMode = "expanded" | "default" | "minimal";
type SortMode = "featured" | "newest" | "price-low" | "price-high";

const viewOptions: Array<{ value: ViewMode; label: string; columns: string }> = [
  { value: "expanded", label: "Expanded", columns: "▯" },
  { value: "default", label: "Default", columns: "▯ ▯" },
  { value: "minimal", label: "Minimal", columns: "▯ ▯ ▯" },
];

function priceValue(product: Product) {
  return product.priceCents ?? Number.MAX_SAFE_INTEGER;
}

function CollectionProductCard({ product, returnTo, view, priority }: { product: Product; returnTo: string; view: ViewMode; priority: boolean }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const mainImage = product.images.find((item) => item.role === "main") ?? product.images[0];
  const image = product.images.find((item) => item.colors?.includes(selectedColor)) ?? mainImage;
  if (!image) return null;
  const href = { pathname: `/shop/${product.slug}`, query: { from: returnTo } };

  if (view === "minimal") {
    return (
      <Link href={href} className="group relative block aspect-[3/4] overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2" aria-label={product.name}>
        <Image src={image.src} alt="" fill priority={priority} sizes="(max-width: 640px) 33vw, 220px" className="object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none" />
      </Link>
    );
  }

  const isExpanded = view === "expanded";
  return (
    <article className={`font-ui ${isExpanded ? "grid gap-4 border-b border-black/15 pb-8 sm:grid-cols-[minmax(0,1.4fr)_minmax(12rem,0.6fr)] sm:gap-7" : "min-w-0"}`}>
      <Link href={href} className={`group relative block overflow-hidden bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${isExpanded ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
        <Image src={image.src} alt={image.alt} fill priority={priority} sizes={isExpanded ? "(max-width: 640px) 100vw, 60vw" : "(max-width: 640px) 50vw, 33vw"} className="object-cover transition duration-500 group-hover:scale-[1.025] motion-reduce:transform-none" />
        {!product.available ? <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em]">Coming soon</span> : null}
      </Link>
      <div className={`${isExpanded ? "flex flex-col justify-end" : "pt-3"}`}>
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black/45">{product.collectionLabel}</p>
        <h2 className={`${isExpanded ? "text-2xl sm:text-3xl" : "text-[0.95rem] sm:text-lg"} font-bold leading-[1.18] tracking-[-0.035em]`}>{product.name}</h2>
        {isExpanded ? <p className="mt-3 max-w-[34ch] text-sm leading-5 text-black/65">{product.shortDescription}</p> : null}
        <p className={`${isExpanded ? "mt-4 text-lg" : "mt-2 text-sm"} font-medium text-black/85`}>{product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}</p>
        {product.colors.length ? <ProductSwatches colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} className={`${isExpanded ? "mt-4" : "mt-3"}`} /> : null}
      </div>
    </article>
  );
}

function FilterDrawer({
  open,
  onClose,
  categories,
  category,
  setCategory,
  inStockOnly,
  setInStockOnly,
  sort,
  setSort,
  count,
}: {
  open: boolean;
  onClose: () => void;
  categories: Array<{ value: string; label: string }>;
  category: string;
  setCategory: (category: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  sort: SortMode;
  setSort: (sort: SortMode) => void;
  count: number;
}) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const clearFilters = () => {
    setCategory("all");
    setInStockOnly(false);
    setSort("featured");
  };

  return (
    <div className={`fixed inset-0 z-[90] transition ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <button type="button" aria-label="Close filters" className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-label="Filters" className={`absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col bg-white transition-transform duration-300 md:inset-y-0 md:left-auto md:w-[28rem] ${open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-black/15 px-5 py-5">
          <h2 className="font-ui text-3xl font-normal tracking-[-0.06em]">Filters</h2>
          <button type="button" aria-label="Close filters" onClick={onClose} className="grid size-10 place-items-center rounded-full text-2xl hover:bg-black/5">×</button>
        </div>
        <div className="overflow-y-auto px-5 pb-28 pt-2">
          <FilterHeading>Sort by</FilterHeading>
          <div className="space-y-1">
            {([
              ["featured", "Featured"],
              ["newest", "Newest"],
              ["price-low", "Price: Low to High"],
              ["price-high", "Price: High to Low"],
            ] as Array<[SortMode, string]>).map(([value, label]) => (
              <label key={value} className="flex min-h-12 items-center gap-3 text-base font-medium">
                <input className="size-5 accent-black" type="radio" name="sort" checked={sort === value} onChange={() => setSort(value)} />
                {label}
              </label>
            ))}
          </div>
          <FilterHeading>Product type</FilterHeading>
          <div className="flex flex-wrap gap-2">
            {[{ value: "all", label: "All products" }, ...categories].map((item) => (
              <button key={item.value} type="button" onClick={() => setCategory(item.value)} className={`min-h-10 rounded-full border px-4 text-sm font-bold transition ${category === item.value ? "border-[#161616] bg-[#161616] text-white" : "border-black/20 hover:border-black"}`}>
                {item.label}
              </button>
            ))}
          </div>
          <FilterHeading>Availability</FilterHeading>
          <label className="flex min-h-12 items-center gap-3 text-base font-medium">
            <input className="size-5 accent-black" type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
            In stock only
          </label>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-3 border-t border-black/15 bg-white p-4">
          <button type="button" onClick={clearFilters} className="min-h-12 flex-1 rounded-full border border-black px-4 text-sm font-bold">Clear all</button>
          <button type="button" onClick={onClose} className="min-h-12 flex-[1.3] rounded-full bg-[#161616] px-4 text-sm font-bold text-white">View {count} product{count === 1 ? "" : "s"}</button>
        </div>
      </section>
    </div>
  );
}

function FilterHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-7 border-t border-black/15 pt-6 text-lg font-bold tracking-[-0.02em] first:mt-0 first:border-0">{children}</h3>;
}

export function CollectionStorefront({ products, returnTo, title }: { products: Product[]; returnTo: string; title: string }) {
  const [view, setView] = useState<ViewMode>("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("featured");
  const categories = useMemo(() => Array.from(new Map(products.map((product) => [product.category, product.categoryLabel])).entries()).map(([value, label]) => ({ value, label })), [products]);
  const filteredProducts = useMemo(() => [...products]
    .filter((product) => category === "all" || product.category === category)
    .filter((product) => !inStockOnly || product.available)
    .sort((a, b) => {
      if (sort === "price-low") return priceValue(a) - priceValue(b);
      if (sort === "price-high") return priceValue(b) - priceValue(a);
      if (sort === "newest") return b.id.localeCompare(a.id);
      return Number(b.featured) - Number(a.featured);
    }), [products, category, inStockOnly, sort]);

  return (
    <section className="mx-auto max-w-7xl px-3 py-8 md:px-6 md:py-14" aria-labelledby="collection-title">
      <div className="mb-7 border-b border-black/15 pb-5 md:mb-10 md:pb-7">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">New arrivals</p>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h1 id="collection-title" className="font-ui text-[2.5rem] font-normal leading-none tracking-[-0.07em] sm:text-6xl">{title}<span className="ml-2 align-middle text-sm font-normal tracking-normal text-black/45">{products.length}</span></h1>
          <button type="button" onClick={() => setFilterOpen(true)} className="font-ui inline-flex min-h-11 items-center gap-2 rounded-full border border-black px-4 text-sm font-bold hover:bg-black hover:text-white">
            <FilterIcon /> Filters
          </button>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex overflow-hidden rounded-full border border-black/20 p-1" role="radiogroup" aria-label="Collection view">
            {viewOptions.map((option) => (
              <button key={option.value} type="button" role="radio" aria-checked={view === option.value} onClick={() => setView(option.value)} aria-label={option.label} className={`grid h-9 min-w-11 place-items-center rounded-full px-2 text-[0.65rem] font-bold tracking-[-0.1em] transition ${view === option.value ? "bg-[#161616] text-white" : "text-black/60 hover:bg-black/5"}`}>
                {option.columns}
              </button>
            ))}
          </div>
          <p className="text-sm font-medium text-black/55">{filteredProducts.length} styles</p>
        </div>
      </div>

      {filteredProducts.length ? (
        <div className={view === "expanded" ? "grid gap-8" : view === "default" ? "grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4" : "grid grid-cols-3 gap-px bg-black/15 sm:grid-cols-4 md:grid-cols-5"}>
          {filteredProducts.map((product, index) => <CollectionProductCard key={product.id} product={product} returnTo={returnTo} view={view} priority={index < 2} />)}
        </div>
      ) : (
        <div className="py-20 text-center"><h2 className="font-ui text-2xl font-bold">No products match these filters.</h2><button type="button" className="mt-4 underline underline-offset-4" onClick={() => { setCategory("all"); setInStockOnly(false); }}>Clear filters</button></div>
      )}
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} categories={categories} category={category} setCategory={setCategory} inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} sort={sort} setSort={setSort} count={filteredProducts.length} />
    </section>
  );
}

function FilterIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4"><path d="M4 7h16M7 12h10M10 17h4" strokeLinecap="round" /></svg>;
}
