import assert from "node:assert/strict";
import { test } from "node:test";
import { mapShopifyProduct } from "../src/lib/commerce/shopify.ts";
import { HIDDEN_VARIANT_SKUS, applyStoreAvailability, applyVariantAvailability, mergeShopifyVariantState } from "../src/lib/variantAvailability.ts";
import { getProductDefaultColor } from "../src/lib/productImages.ts";
import { classicUaHoodie, shopCategories } from "./fixtures/ua-hoodie.mjs";

const variant = (id, color, size, extra = {}) => ({ id, color, size, available: true, cartUrl: `https://t.myshopify.com/cart/add?id=${id}&quantity=1`, ...extra });
const product = (variants, extra = {}) => ({
  id: "p", name: "P", colors: [...new Set(variants.map((v) => v.color))], sizes: [...new Set(variants.map((v) => v.size))],
  images: [], variants, available: variants.some((v) => v.available), ...extra,
});

test("the hidden list holds exactly the eight unavailable Under Armour hoodie SKUs", () => {
  assert.equal(HIDDEN_VARIANT_SKUS.size, 8);
  for (const sku of ["7715585_19721", "7715585_19731", "7715585_19713", "7715585_19723", "7715585_19733", "7725255_19727", "7725255_19713", "7725255_19723"]) {
    assert.ok(HIDDEN_VARIANT_SKUS.has(sku), sku);
  }
});

test("Classic Under Armour hoodie only offers Black / S", () => {
  previousDomain(() => {
    const result = applyVariantAvailability(mapShopifyProduct(classicUaHoodie, shopCategories));
    const skus = result.variants.map((v) => v.sku);
    for (const sku of HIDDEN_VARIANT_SKUS) assert.ok(!skus.includes(sku), `${sku} must be removed`);
    const purchasable = result.variants.filter((v) => v.available && v.cartUrl).map((v) => `${v.color} / ${v.size}`);
    assert.deepEqual(purchasable, ["Black / S"]);
    // Navy keeps sold-out sizes, so its swatch stays but is disabled.
    assert.deepEqual(result.colors, ["Black", "Navy"]);
    assert.deepEqual(result.sizes, ["S", "M", "XL"]);
    assert.equal(result.available, true);
    assert.equal(getProductDefaultColor(result), "Black");
  });
});

test("a color with no variants left loses its swatch", () => {
  const result = applyVariantAvailability(product([
    variant("1", "Grey", "XL", { sku: "7725255_19727" }),
    variant("2", "Navy", "S", { sku: "7725255_19713" }),
    variant("3", "Navy", "L", { sku: "7725255_19723" }),
    variant("4", "Black", "M"),
  ]));
  assert.deepEqual(result.colors, ["Black"]);
  assert.deepEqual(result.sizes, ["M"]);
  assert.deepEqual(result.variants.map((v) => v.id), ["4"]);
});

test("a product with nothing purchasable left is sold out, not an error", () => {
  const hiddenOnly = applyVariantAvailability(product([variant("1", "Navy", "S", { sku: "7725255_19713" })]));
  assert.deepEqual(hiddenOnly.variants, []);
  assert.deepEqual(hiddenOnly.colors, []);
  assert.equal(hiddenOnly.available, false);
  assert.equal(hiddenOnly.soldOut, true);

  const storeSoldOut = applyVariantAvailability(product([applyStoreAvailability(variant("1", "Moss", "One size"), false)], { available: true }));
  assert.equal(storeSoldOut.variants[0].available, false);
  assert.equal(storeSoldOut.available, false);
  assert.equal(storeSoldOut.soldOut, true);
});

test("Shopify sold-out variants stay visible but disabled", () => {
  const result = applyVariantAvailability(product([variant("1", "Moss", "One size"), variant("2", "Khaki", "One size")].map((v, i) => applyStoreAvailability(v, i !== 0))));
  assert.deepEqual(result.colors, ["Moss", "Khaki"]);
  assert.deepEqual(result.variants.map((v) => v.available), [false, true]);
  assert.equal(result.available, true);
  assert.equal(result.soldOut, false);
});

test("products without hidden or sold-out variants are returned untouched", () => {
  const input = product([variant("1", "Black", "S", { sku: "other" })]);
  assert.equal(applyVariantAvailability(input), input);
  const comingSoon = product([variant("1", "Black", "S", { available: false })]);
  assert.equal(applyVariantAvailability(comingSoon).soldOut, undefined);
});

test("Printful variants pick up Shopify's sold-out state and SKU", () => {
  const merged = mergeShopifyVariantState(
    [variant("101", "Moss", "One size"), variant("102", "Khaki", "One size", { sku: "pf" }), variant("103", "Navy", "S")],
    [applyStoreAvailability(variant("101", "Moss", "One size", { sku: "moss" }), false), variant("102", "Khaki", "One size", { sku: "shop" }), variant("103", "Navy", "S", { sku: "7725255_19713" })],
  );
  assert.deepEqual(merged.map((v) => [v.sku, v.available]), [["moss", false], ["pf", true], ["7725255_19713", true]]);
  const result = applyVariantAvailability(product(merged));
  assert.deepEqual(result.variants.map((v) => v.id), ["101", "102"]);
  assert.deepEqual(result.colors, ["Moss", "Khaki"]);
});

function previousDomain(run) {
  const previous = process.env.SHOPIFY_STORE_DOMAIN;
  process.env.SHOPIFY_STORE_DOMAIN = "nyes-neck.myshopify.com";
  try { run(); } finally {
    if (previous === undefined) delete process.env.SHOPIFY_STORE_DOMAIN;
    else process.env.SHOPIFY_STORE_DOMAIN = previous;
  }
}
