import assert from "node:assert/strict";
import { test } from "node:test";
import { assignFavoriteColors, colorFamily } from "../src/lib/favoriteColors.ts";

const product = (id, colors, { codes = {}, soldOut = [], noPhoto = [] } = {}) => ({
  id,
  colors,
  images: colors.filter((color) => !noPhoto.includes(color)).map((color) => ({ id: `${id}-${color}`, src: `/${id}-${color}.png`, alt: "", role: "gallery", colors: [color] })),
  variants: colors.map((color) => ({ id: `${id}-${color}`, color, colorCode: codes[color], available: !soldOut.includes(color) })),
});

test("color families come from names first, then hex codes", () => {
  assert.equal(colorFamily("Navy", "#1b1f2a"), "blue");
  assert.equal(colorFamily("Black"), "dark");
  assert.equal(colorFamily("Lagoon", "#5fb3c4"), "blue");
  assert.equal(colorFamily("Yam", "#d9772f"), "warm");
  assert.equal(colorFamily("Mystery"), undefined);
});

test("favorites open on an assortment of colors, not all black", () => {
  const catalog = [
    product("a", ["Black", "Navy", "Ivy", "Red"]),
    product("b", ["Black", "Navy", "Ivy", "Red"]),
    product("c", ["Black", "Navy", "Ivy", "Red"]),
    product("d", ["Black", "Navy", "Ivy", "Red"]),
  ];
  const picks = Object.values(assignFavoriteColors(catalog));
  assert.equal(new Set(picks).size, 4);
  assert.ok(picks.indexOf("Black") === -1 || picks.indexOf("Black") === 3);
});

test("only colors with a photo that can be bought are used", () => {
  const picks = assignFavoriteColors([product("a", ["Black", "Red", "Navy"], { soldOut: ["Red"], noPhoto: ["Navy"] })]);
  assert.equal(picks.a, "Black");
});
