"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";
import { ProductGrid } from "./ProductGrid";

type FilterKey = "type" | "brand" | "color" | "size" | "collection";
type SelectedFilters = Record<FilterKey, string[]>;

const EMPTY_FILTERS: SelectedFilters = { type: [], brand: [], color: [], size: [], collection: [] };

function unique(values: (string | undefined)[]) {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))].sort((a, b) => a.localeCompare(b));
}

export function ShopCatalog({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState<SelectedFilters>(EMPTY_FILTERS);
  const options = useMemo(() => ({
    type: unique(products.map((product) => product.categoryLabel)),
    brand: unique(products.map((product) => product.brand)),
    color: unique(products.flatMap((product) => product.colors)),
    size: unique(products.flatMap((product) => product.sizes)),
    collection: unique(products.map((product) => product.collectionLabel)),
  }), [products]);
  const filteredProducts = useMemo(() => products.filter((product) => (
    (!selected.type.length || selected.type.includes(product.categoryLabel))
    && (!selected.brand.length || Boolean(product.brand && selected.brand.includes(product.brand)))
    && (!selected.color.length || selected.color.some((color) => product.colors.includes(color)))
    && (!selected.size.length || selected.size.some((size) => product.sizes.includes(size)))
    && (!selected.collection.length || selected.collection.includes(product.collectionLabel))
  )), [products, selected]);
  const hasFilters = Object.values(selected).some((values) => values.length);

  function toggle(key: FilterKey, value: string) {
    setSelected((current) => ({
      ...current,
      [key]: current[key].includes(value) ? current[key].filter((item) => item !== value) : [...current[key], value],
    }));
  }

  return <section className="mt-16 border-t border-black/10 pt-11 md:mt-24 md:pt-16" aria-labelledby="all-products-heading">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#183247]/60">All pieces</p><h2 id="all-products-heading" className="font-heading mt-2 text-[2.25rem] font-semibold tracking-[-0.05em] md:text-5xl">Shop the collection</h2></div>
      {hasFilters ? <button type="button" onClick={() => setSelected(EMPTY_FILTERS)} className="min-h-11 rounded-full border border-black/20 px-4 text-sm font-semibold transition hover:border-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2">Clear filters</button> : null}
    </div>
    <div className="mt-8 grid gap-5 border-y border-black/10 py-6 sm:grid-cols-2 lg:grid-cols-5">
      <FilterGroup label="Product type" values={options.type} selected={selected.type} onToggle={(value) => toggle("type", value)} />
      {options.brand.length ? <FilterGroup label="Brand" values={options.brand} selected={selected.brand} onToggle={(value) => toggle("brand", value)} /> : null}
      <FilterGroup label="Color" values={options.color} selected={selected.color} onToggle={(value) => toggle("color", value)} />
      <FilterGroup label="Size" values={options.size} selected={selected.size} onToggle={(value) => toggle("size", value)} />
      <FilterGroup label="Collection" values={options.collection} selected={selected.collection} onToggle={(value) => toggle("collection", value)} />
    </div>
    <p className="mt-6 text-sm text-black/60" aria-live="polite">{filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}</p>
    <div className="mt-6">{filteredProducts.length ? <ProductGrid products={filteredProducts} returnTo="shop" /> : <p className="rounded-2xl bg-[#e9e1d3] px-6 py-10 text-center text-base text-black/70">No products match those filters. Try clearing one or more filters.</p>}</div>
  </section>;
}

function FilterGroup({ label, values, selected, onToggle }: { label: string; values: string[]; selected: string[]; onToggle: (value: string) => void }) {
  if (!values.length) return null;
  return <fieldset><legend className="text-sm font-semibold">{label}</legend><div className="mt-3 flex flex-wrap gap-2">{values.map((value) => <button key={value} type="button" onClick={() => onToggle(value)} aria-pressed={selected.includes(value)} className={`min-h-9 rounded-full border px-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${selected.includes(value) ? "border-[#183247] bg-[#183247] text-white" : "border-black/15 bg-white hover:border-black/50"}`}>{value}</button>)}</div></fieldset>;
}
