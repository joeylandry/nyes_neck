"use client";

import Image from "next/image";
import { useState } from "react";

export type FrontPhotoRow = { key: string; product: string; color: string; image: string; fileName: string; personPhoto: boolean };

/**
 * Every color's front photo, so photos that show a person can be ticked and
 * sent over for src/data/personPhotos.ts.
 */
export function FrontPhotoPicker({ rows }: { rows: FrontPhotoRow[] }) {
  const [selected, setSelected] = useState(() => new Set<string>());
  const [copied, setCopied] = useState(false);

  const toggle = (key: string) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  const copySelected = async () => {
    const text = rows.filter((row) => selected.has(row.key))
      .map((row) => `"${row.fileName}", // ${row.product}${row.color ? ` (${row.color})` : ""}`)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy the photos that show a person:", text);
    }
  };

  return (
    <>
      <div className="sticky top-[calc(var(--site-header-height)+2.75rem)] z-10 mt-6 flex items-center justify-between gap-3 rounded-full border border-black/15 bg-white/95 px-4 py-2 backdrop-blur">
        <p className="text-sm font-semibold">{selected.size} photos with people ticked</p>
        <button type="button" onClick={copySelected} disabled={!selected.size} className="min-h-10 rounded-full bg-[#161616] px-4 text-sm font-bold text-white disabled:opacity-40">
          {copied ? "Copied!" : "Copy ticked"}
        </button>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {rows.map((row) => (
          <li key={row.key}>
            <label className={`flex h-full cursor-pointer flex-col gap-2 rounded-xl border p-2 text-xs ${selected.has(row.key) ? "border-black ring-1 ring-black" : "border-black/10"}`}>
              <span className="relative block aspect-[4/5] overflow-hidden rounded-lg bg-white">
                <Image src={row.image} alt="" fill sizes="(min-width: 1024px) 160px, 45vw" className="object-contain" />
              </span>
              <span className="font-semibold leading-snug">{row.product}</span>
              {row.color ? <span className="text-black/60">{row.color}</span> : null}
              <span className="break-all text-[0.68rem] text-black/45">{row.fileName}</span>
              {row.personPhoto ? (
                <span className="font-semibold text-[#8a2a2a]">Only photos with people for this color</span>
              ) : null}
              <span className="mt-auto flex items-center gap-2 font-semibold">
                <input type="checkbox" className="size-4 accent-black" checked={selected.has(row.key)} onChange={() => toggle(row.key)} />
                Shows a person
              </span>
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
