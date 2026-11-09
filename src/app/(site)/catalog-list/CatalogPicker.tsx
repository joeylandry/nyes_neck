"use client";

import Image from "next/image";
import { useState } from "react";

export type CatalogRow = { id: string; name: string; image: string; type: string; brand: string; model: string; decoration: string; style: string; favorite: boolean };

export function CatalogPicker({ rows }: { rows: CatalogRow[] }) {
  const [selected, setSelected] = useState(() => new Set(rows.filter((row) => row.favorite).map((row) => row.id)));
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const copySelected = async () => {
    const text = rows.filter((row) => selected.has(row.id))
      .map((row) => `- ${row.name} (${[row.brand, row.decoration, row.style].filter(Boolean).join(", ") || "no tags"}) [${row.id}]`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy the selected products:", text);
    }
  };

  return (
    <>
      <div className="sticky top-[calc(var(--site-header-height)+2.75rem)] z-10 mt-6 flex items-center justify-between gap-3 rounded-full border border-black/15 bg-white/95 px-4 py-2 backdrop-blur">
        <p className="text-sm font-semibold">{selected.size} selected of {rows.length}</p>
        <button type="button" onClick={copySelected} className="min-h-10 rounded-full bg-[#161616] px-4 text-sm font-bold text-white">
          {copied ? "Copied!" : "Copy selected"}
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-black/20 text-xs uppercase tracking-[0.12em] text-black/55">
            <tr>
              <th className="py-2 pr-3 font-bold"><span className="sr-only">Favorite</span></th>
              <th className="py-2 pr-3 font-bold"><span className="sr-only">Photo</span></th>
              <th className="py-2 pr-3 font-bold">Title</th>
              <th className="py-2 pr-3 font-bold">Type</th>
              <th className="py-2 pr-3 font-bold">Brand</th>
              <th className="py-2 pr-3 font-bold">Model</th>
              <th className="py-2 pr-3 font-bold">Embroidered / Printed</th>
              <th className="py-2 pr-3 font-bold">Classic / Retro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-black/10">
                <td className="py-2 pr-3">
                  <input type="checkbox" className="size-4 accent-black" checked={selected.has(row.id)} onChange={() => toggle(row.id)} aria-label={`Include ${row.name}`} />
                </td>
                <td className="py-2 pr-3">
                  {row.image ? (
                    <span className="relative block size-16 overflow-hidden rounded-lg border border-black/10 bg-white">
                      <Image src={row.image} alt="" fill sizes="64px" className="object-contain p-1" />
                    </span>
                  ) : null}
                </td>
                <td className="py-2 pr-3 font-semibold">{row.name}</td>
                <td className="py-2 pr-3 text-black/70">{row.type}</td>
                <td className="py-2 pr-3 text-black/70">{row.brand || <span className="text-black/40">No brand listed</span>}</td>
                <td className="py-2 pr-3 text-black/70">{row.model || "—"}</td>
                <td className="py-2 pr-3 text-black/70">{row.decoration || "—"}</td>
                <td className="py-2 pr-3 text-black/70">{row.style || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
