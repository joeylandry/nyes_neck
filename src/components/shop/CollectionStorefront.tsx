"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import { getProductDefaultColor } from "@/lib/productImages";
import type { Product } from "@/types/product";
import { ProductSwatches } from "./ProductCard";
import { ProductCardMedia } from "./ProductCardMedia";

type ViewMode = "expanded" | "default" | "minimal";
type SortMode = "featured" | "newest" | "price-low" | "price-high";
type FacetKey = "type" | "brand" | "size";
type SelectedFacets = Record<FacetKey, string[]>;
type FilterGroup = { label: string; values: string[] };

const EMPTY_FACETS: SelectedFacets = { type: [], brand: [], size: [] };

const sortOptions: Array<{ value: SortMode; label: string }> = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const viewOptions: Array<{ value: ViewMode; label: string; columns: string }> = [
  { value: "expanded", label: "Expanded", columns: "▯" },
  { value: "default", label: "Default", columns: "▯ ▯" },
  { value: "minimal", label: "Minimal", columns: "▯ ▯ ▯" },
];

function priceValue(product: Product) {
  return product.priceCents ?? Number.MAX_SAFE_INTEGER;
}

function CollectionProductCard({ product, returnTo, view, priority }: { product: Product; returnTo: string; view: ViewMode; priority: boolean }) {
  const [selectedColor, setSelectedColor] = useState(() => getProductDefaultColor(product));
  const href = { pathname: `/shop/${product.slug}`, query: { from: returnTo } };
  const colorCodes = useMemo(() => Object.fromEntries(product.colors.map((color) => [color, product.variants.find((variant) => variant.color === color && variant.colorCode)?.colorCode])), [product.colors, product.variants]);

  if (view === "minimal") {
    return (
      <ProductCardMedia key={selectedColor} product={product} selectedColor={selectedColor} href={href} priority={priority} sizes="(max-width: 640px) 33vw, 220px" aspectClass="aspect-[3/4]" />
    );
  }

  const isExpanded = view === "expanded";
  return (
    <article className={`font-ui ${isExpanded ? "grid min-w-0 grid-cols-1 gap-4 border-b border-black/15 pb-8 sm:grid-cols-[minmax(0,1.4fr)_minmax(12rem,0.6fr)] sm:gap-7" : "min-w-0"}`}>
      <ProductCardMedia key={selectedColor} product={product} selectedColor={selectedColor} href={href} priority={priority} sizes={isExpanded ? "(max-width: 640px) 100vw, 60vw" : "(max-width: 640px) 50vw, 33vw"} aspectClass={isExpanded ? "aspect-[4/5]" : "aspect-[3/4]"} />
      <div className={`${isExpanded ? "flex flex-col justify-end" : "pt-3"}`}>
        <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black/45">{product.collectionLabel}</p>
        <h2 className={`${isExpanded ? "text-2xl sm:text-3xl" : "text-[0.95rem] sm:text-lg"} font-bold leading-[1.18] tracking-[-0.035em]`}>{product.name}</h2>
        {isExpanded ? <p className="mt-3 max-w-[34ch] text-sm leading-5 text-black/65">{product.shortDescription}</p> : null}
        <p className={`${isExpanded ? "mt-4 text-lg" : "mt-2 text-sm"} font-medium text-black/85`}>{product.priceCents === null ? "Pricing to be announced" : formatCurrency(product.priceCents, product.currency)}</p>
        {product.colors.length ? <ProductSwatches colors={product.colors} selectedColor={selectedColor} onColorChange={setSelectedColor} colorCodes={colorCodes} className={`${isExpanded ? "mt-4" : "mt-3"}`} /> : null}
      </div>
    </article>
  );
}

function FilterDrawer({
  open,
  onClose,
  options,
  selected,
  onToggle,
  onClear,
  inStockOnly,
  setInStockOnly,
  sort,
  setSort,
  count,
}: {
  open: boolean;
  onClose: () => void;
  options: SelectedFacets;
  selected: SelectedFacets;
  onToggle: (key: FacetKey, value: string) => void;
  onClear: () => void;
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
    onClear();
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
          <div className="border-b border-black/15 py-5">
            <label htmlFor="filter-sort" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-black/55">Sort by</label>
            <select id="filter-sort" value={sort} onChange={(event) => setSort(event.target.value as SortMode)} className="min-h-11 w-full rounded-md border border-black/25 bg-white px-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              {sortOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <FilterMenu label="Product type" groups={productTypeGroups(options.type)} selected={selected.type} onToggle={(value) => onToggle("type", value)} defaultOpen />
          {options.brand.length ? <FilterMenu label="Brands" groups={brandGroups(options.brand)} selected={selected.brand} onToggle={(value) => onToggle("brand", value)} /> : null}
          {options.size.length ? <FilterMenu label="Size" groups={sizeGroups(options.size)} selected={selected.size} onToggle={(value) => onToggle("size", value)} /> : null}
          <div className="border-b border-black/15 py-1">
            <label className="flex min-h-12 cursor-pointer items-center gap-3 text-sm font-bold">
              <input className="size-4 rounded-sm accent-black" type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} />
              In stock only
            </label>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-3 border-t border-black/15 bg-white p-4">
          <button type="button" onClick={clearFilters} className="min-h-12 flex-1 rounded-full border border-black px-4 text-sm font-bold">Clear all</button>
          <button type="button" onClick={onClose} className="min-h-12 flex-[1.3] rounded-full bg-[#161616] px-4 text-sm font-bold text-white">View {count} product{count === 1 ? "" : "s"}</button>
        </div>
      </section>
    </div>
  );
}

function FilterMenu({ label, groups, selected, onToggle, defaultOpen = false }: { label: string; groups: FilterGroup[]; selected: string[]; onToggle: (value: string) => void; defaultOpen?: boolean }) {
  const selectedCount = selected.length;

  return (
    <details className="group border-b border-black/15" open={defaultOpen}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 text-base font-bold marker:content-none">
        <span>{label}{selectedCount ? <span className="ml-2 text-sm font-medium text-black/50">({selectedCount})</span> : null}</span>
        <ChevronIcon />
      </summary>
      <div className="-mt-1 space-y-5 pb-5">
        {groups.map((group) => (
          <div key={group.label}>
            {group.label ? <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-black/45">{group.label}</p> : null}
            <ul>
              {group.values.map((value) => {
                const active = selected.includes(value);
                return (
                  <li key={value}>
                    <label className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-sm px-1 text-sm font-medium transition hover:bg-black/[0.035] ${active ? "text-black" : "text-black/75"}`}>
                      <input className="size-4 rounded-sm accent-black" type="checkbox" checked={active} onChange={() => onToggle(value)} />
                      {value}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

function productTypeGroups(values: string[]): FilterGroup[] {
  const groups = [
    { label: "Clothing", match: /shirt|hoodie|sweatshirt|crewneck|polo|quarter|jacket|vest|apron/i },
    { label: "Headwear", match: /hat|cap|beanie/i },
    { label: "Drinkware", match: /glass|tumbler|drinkware|mug|bottle|cup/i },
  ];
  const matched = new Set<string>();
  const organized = groups.map(({ label, match }) => {
    const items = values.filter((value) => match.test(value));
    items.forEach((item) => matched.add(item));
    return { label, values: items };
  }).filter((group) => group.values.length);
  const remaining = values.filter((value) => !matched.has(value));
  if (remaining.length) organized.push({ label: "Home & accessories", values: remaining });
  return organized;
}

function brandGroups(values: string[]): FilterGroup[] {
  return values.length ? [{ label: "All brands", values }] : [];
}

function sizeGroups(values: string[]): FilterGroup[] {
  const adult = values.filter((value) => /^(?:XXS|XS|S|M|L|XL|XXL|2XL|3XL)$/i.test(value));
  const youth = values.filter((value) => /youth|\bY(?:XS|S|M|L|XL)\b/i.test(value));
  const matched = new Set([...adult, ...youth]);
  const groups: FilterGroup[] = [];
  if (adult.length) groups.push({ label: "Adult sizes", values: adult });
  if (youth.length) groups.push({ label: "Youth sizes", values: youth });
  const remaining = values.filter((value) => !matched.has(value));
  if (remaining.length) groups.push({ label: "Other sizes", values: remaining });
  return groups;
}

export function CollectionStorefront({ products, returnTo, title }: { products: Product[]; returnTo: string; title: string }) {
  const [view, setView] = useState<ViewMode>("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedFacets>(EMPTY_FACETS);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("featured");
  const options = useMemo<SelectedFacets>(() => ({
    type: unique(products.map((product) => product.categoryLabel)),
    brand: unique(products.map((product) => product.brand)),
    size: unique(products.flatMap((product) => product.sizes)),
  }), [products]);
  const filteredProducts = useMemo(() => [...products]
    .filter((product) => !selected.type.length || selected.type.includes(product.categoryLabel))
    .filter((product) => !selected.brand.length || Boolean(product.brand && selected.brand.includes(product.brand)))
    .filter((product) => !selected.size.length || selected.size.some((size) => product.sizes.includes(size)))
    .filter((product) => !inStockOnly || product.available)
    .sort((a, b) => {
      if (sort === "price-low") return priceValue(a) - priceValue(b);
      if (sort === "price-high") return priceValue(b) - priceValue(a);
      if (sort === "newest") return b.id.localeCompare(a.id);
      return Number(b.featured) - Number(a.featured);
    }), [products, selected, inStockOnly, sort]);
  const activeFilterCount = Object.values(selected).reduce((total, values) => total + values.length, 0) + Number(inStockOnly);

  const toggleFacet = (key: FacetKey, value: string) => {
    setSelected((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));
  };
  const clearFilters = () => {
    setSelected(EMPTY_FACETS);
    setInStockOnly(false);
    setSort("featured");
  };

  return (
    <section className="mx-auto max-w-7xl px-3 py-8 md:px-6 md:py-14" aria-labelledby="collection-title">
      <div className="mb-7 border-b border-black/15 pb-5 md:mb-10 md:pb-7">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-black/45">New arrivals</p>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h1 id="collection-title" className="font-ui text-[2.5rem] font-normal leading-none tracking-[-0.07em] sm:text-6xl">{title}<span className="ml-2 align-middle text-sm font-normal tracking-normal text-black/45">{products.length}</span></h1>
          <button type="button" onClick={() => setFilterOpen(true)} className="font-ui inline-flex min-h-11 items-center gap-2 rounded-full border border-black px-4 text-sm font-bold hover:bg-black hover:text-white">
            <FilterIcon /> Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
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
        <div className={view === "expanded" ? "grid min-w-0 grid-cols-1 gap-8" : view === "default" ? "grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4" : "grid grid-cols-3 gap-px bg-black/15 sm:grid-cols-4 md:grid-cols-5"}>
          {filteredProducts.map((product, index) => <CollectionProductCard key={product.id} product={product} returnTo={returnTo} view={view} priority={index < 2} />)}
        </div>
      ) : (
        <div className="py-20 text-center"><h2 className="font-ui text-2xl font-bold">No products match these filters.</h2><button type="button" className="mt-4 underline underline-offset-4" onClick={clearFilters}>Clear filters</button></div>
      )}
      <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} options={options} selected={selected} onToggle={toggleFacet} onClear={clearFilters} inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} sort={sort} setSort={setSort} count={filteredProducts.length} />
    </section>
  );
}

function unique(values: Array<string | undefined>) {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function FilterIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4"><path d="M4 7h16M7 12h10M10 17h4" strokeLinecap="round" /></svg>;
}

function ChevronIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0 transition-transform group-open:rotate-180"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
