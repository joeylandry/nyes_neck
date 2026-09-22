import assert from "node:assert/strict";
import { test } from "node:test";
import { groupByProductType, OTHER_FAMILY_LABEL, UNGROUPED_SECTION_KEY } from "../src/lib/collectionSections.ts";

const item = (id, categoryLabel) => ({ id, categoryLabel });

test("collection sections lead with apparel, then headwear, drinkware, and the rest", () => {
  const sections = groupByProductType([
    item("a", "Stickers"),
    item("b", "Stickers"),
    item("c", "Tumblers"),
    item("d", "Tumblers"),
    item("e", "Hats"),
    item("f", "Hats"),
    item("g", "T-shirts"),
    item("h", "T-shirts"),
  ]);

  assert.deepEqual(sections.map((section) => section.label), ["T-shirts", "Hats", "Tumblers", "Stickers"]);
  assert.deepEqual(sections.map((section) => section.products.length), [2, 2, 2, 2]);
});

test("larger product types come first within a family", () => {
  const sections = groupByProductType([
    item("a", "Hoodies"),
    item("b", "Hoodies"),
    item("c", "T-shirts"),
    item("d", "T-shirts"),
    item("e", "T-shirts"),
  ]);

  assert.deepEqual(sections.map((section) => section.label), ["T-shirts", "Hoodies"]);
});

test("single-product types are pooled so the page is not a run of one-item headings", () => {
  const sections = groupByProductType([
    item("a", "T-shirts"),
    item("b", "T-shirts"),
    item("c", "Aprons"),
    item("d", "Stickers"),
    item("e", "Towels"),
  ]);

  assert.deepEqual(sections.map((section) => section.key), ["T-shirts", UNGROUPED_SECTION_KEY]);
  // The pool keeps the family order the standalone sections would have had.
  assert.deepEqual(sections[1].products.map((product) => product.id), ["c", "d", "e"]);
});

test("a product with no type label falls back to the accessories heading", () => {
  const sections = groupByProductType([item("a", ""), item("b", undefined)]);

  assert.deepEqual(sections.map((section) => section.label), [OTHER_FAMILY_LABEL]);
  assert.equal(sections[0].products.length, 2);
});

test("a lone single-product type keeps its own heading", () => {
  const sections = groupByProductType([item("a", "T-shirts"), item("b", "T-shirts"), item("c", "Hats")]);

  assert.deepEqual(sections.map((section) => section.label), ["T-shirts", "Hats"]);
});
