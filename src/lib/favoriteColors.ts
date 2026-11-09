import { FAVORITE_START_COLORS } from "@/data/favoritePicks";
import type { Product } from "@/types/product";

/**
 * Picks the color each Our Favorites card opens on, so the grid shows an
 * assortment of garment colors instead of a wall of black. Each product only
 * uses a color it has a photo for and can be bought in.
 */
export type ColorFamily = "dark" | "gray" | "light" | "red" | "warm" | "brown" | "green" | "blue" | "purple";

const NAME_FAMILIES: Array<[ColorFamily, RegExp]> = [
  ["dark", /\b(?:black|charcoal|onyx|jet|graphite)\b/i],
  ["brown", /\b(?:brown|espresso|chocolate|mocha|coffee|chestnut)\b/i],
  ["light", /\b(?:white|ivory|cream|natural|bone|sand|khaki|oat|vanilla|beige|ecru|parchment)\b/i],
  ["gray", /\b(?:gr[ae]y|heather|granite|pepper|slate|ash|silver|stone)\b/i],
  ["red", /\b(?:red|crimson|brick|cardinal|burgundy|maroon|chili|paprika|cranberry|wine|scarlet)\b/i],
  ["warm", /\b(?:orange|yam|terracotta|mustard|yellow|butter|gold|citrus|peach|coral|banana)\b/i],
  ["green", /\b(?:green|ivy|sage|moss|hemp|forest|olive|pine|emerald|seafoam|mint|spruce)\b/i],
  ["blue", /\b(?:blue|navy|denim|royal|sky|ocean|lagoon|chambray|teal|aqua|indigo|marine)\b/i],
  ["purple", /\b(?:purple|violet|grape|orchid|lavender|plum|berry|pink|blossom|watermelon|rose|magenta)\b/i],
];

function hexFamily(hex: string): ColorFamily | undefined {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return undefined;
  const value = Number.parseInt(match[1], 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((channel) => channel / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  const delta = max - min;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  if (lightness < 0.16) return "dark";
  if (saturation < 0.16) return lightness > 0.78 ? "light" : lightness < 0.3 ? "dark" : "gray";
  let hue = 0;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue = (hue * 60 + 360) % 360;
  if (hue < 15 || hue >= 340) return lightness < 0.3 ? "brown" : "red";
  if (hue < 65) return lightness < 0.35 ? "brown" : lightness > 0.8 ? "light" : "warm";
  if (hue < 170) return "green";
  if (hue < 260) return "blue";
  return "purple";
}

export function colorFamily(name: string, hex?: string): ColorFamily | undefined {
  // The name wins when it is clear ("Navy" is blue even if its hex reads as
  // near-black); the hex settles creative names like "Lagoon" or "Yam".
  return NAME_FAMILIES.find(([, pattern]) => pattern.test(name))?.[0] ?? (hex ? hexFamily(hex) : undefined);
}

/** Colors the shopper can open on: a front photo exists and some size is in stock. */
function showableColors(product: Product) {
  return product.colors.filter((color) =>
    product.images.some((image) => image.colors?.includes(color)) &&
    (!product.variants.length || product.variants.some((variant) => variant.color === color && variant.available)));
}

// Muted families read as "black and stuff"; they are a last resort.
const FAMILY_PENALTY: Partial<Record<ColorFamily, number>> = { dark: 6, gray: 2 };

/** A hand-chosen start color, when it is one the shopper can open on. */
function chosenColor(product: Product, options: string[], chosen: Record<string, string>) {
  const color = chosen[product.id] ?? (product.externalId ? chosen[product.externalId] : undefined);
  return color ? options.find((option) => option.toLowerCase() === color.trim().toLowerCase()) : undefined;
}

export function assignFavoriteColors(products: Product[], chosen: Record<string, string> = FAVORITE_START_COLORS): Record<string, string> {
  const used = new Map<ColorFamily | "other", number>();
  const picks: Record<string, string> = {};
  const recent: Array<ColorFamily | "other"> = [];

  for (const product of products) {
    const options = showableColors(product);
    if (!options.length) continue;
    const picked = chosenColor(product, options, chosen);
    let best = picked ?? options[0];
    let bestScore = Number.POSITIVE_INFINITY;
    if (!picked) options.forEach((color, index) => {
      const code = product.variants.find((variant) => variant.color === color && variant.colorCode)?.colorCode;
      const family = colorFamily(color, code) ?? "other";
      const score = (used.get(family) ?? 0) * 3 +
        (FAMILY_PENALTY[family as ColorFamily] ?? 0) +
        // Neighbors in the grid should not match.
        (recent.includes(family) ? 5 : 0) +
        // Ties keep the product's own listing order.
        index * 0.01;
      if (score < bestScore) {
        bestScore = score;
        best = color;
      }
    });
    const code = product.variants.find((variant) => variant.color === best && variant.colorCode)?.colorCode;
    const family = colorFamily(best, code) ?? "other";
    used.set(family, (used.get(family) ?? 0) + 1);
    recent.push(family);
    if (recent.length > 3) recent.shift();
    picks[product.id] = best;
  }
  return picks;
}
